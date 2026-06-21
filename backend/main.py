from __future__ import annotations

import asyncio
import base64
import hashlib
import hmac
import json
import mimetypes
import os
import re
import secrets
import shutil
import tempfile
import time
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Optional
from urllib.parse import quote

from fastapi import Depends, FastAPI, File, Form, HTTPException, Query, Request, Response, UploadFile
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from telethon import TelegramClient
from telethon.errors import PhoneCodeExpiredError, PhoneCodeInvalidError, SessionPasswordNeededError

APP_NAME = "Telegram Drive Web"
APP_VERSION = "0.4.0-responsive-search"
META_PREFIX = "TDWEB_META:v1:"
COOKIE_NAME = "tdweb_session"
SESSION_TTL_SECONDS = 12 * 60 * 60
DEFAULT_SCAN_LIMIT = int(os.environ.get("TDWEB_SCAN_LIMIT", "4000"))
SEARCH_SCAN_LIMIT = int(os.environ.get("TDWEB_SEARCH_SCAN_LIMIT", "12000"))
MAX_SCAN_LIMIT = int(os.environ.get("TDWEB_MAX_SCAN_LIMIT", "20000"))

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
DATA_DIR = Path(os.environ.get("TDWEB_DATA_DIR", BASE_DIR / "data")).resolve()
CONFIG_PATH = DATA_DIR / "config.json"
SECRET_PATH = DATA_DIR / "cookie_secret.key"
SESSION_PATH = DATA_DIR / "telegram"
DOWNLOAD_CACHE_DIR = DATA_DIR / "download_cache"
UPLOAD_TMP_DIR = DATA_DIR / "upload_tmp"

SERVER_PASSWORD = os.environ.get("TDWEB_SERVER_PASSWORD", "").strip()
ALLOW_NO_PASSWORD = os.environ.get("TDWEB_ALLOW_NO_PASSWORD", "0") == "1"
COOKIE_SECURE = os.environ.get("TDWEB_COOKIE_SECURE", "0") == "1"

DATA_DIR.mkdir(parents=True, exist_ok=True)
DOWNLOAD_CACHE_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_TMP_DIR.mkdir(parents=True, exist_ok=True)


def _load_or_create_cookie_secret() -> bytes:
    env_secret = os.environ.get("TDWEB_COOKIE_SECRET", "").strip()
    if env_secret:
        return env_secret.encode("utf-8")
    if SECRET_PATH.exists():
        return SECRET_PATH.read_bytes().strip()
    secret = secrets.token_urlsafe(48).encode("utf-8")
    SECRET_PATH.write_bytes(secret)
    try:
        os.chmod(SECRET_PATH, 0o600)
    except OSError:
        pass
    return secret


COOKIE_SECRET = _load_or_create_cookie_secret()


def _json_response(data: Any, status_code: int = 200) -> JSONResponse:
    return JSONResponse(content=data, status_code=status_code)


def _now() -> int:
    return int(time.time())


def _sign(value: str) -> str:
    digest = hmac.new(COOKIE_SECRET, value.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{value}.{digest}"


def _verify_signed(signed: str) -> Optional[str]:
    if not signed or "." not in signed:
        return None
    value, digest = signed.rsplit(".", 1)
    expected = hmac.new(COOKIE_SECRET, value.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, digest):
        return None
    return value


def make_session_cookie() -> str:
    return _sign(str(_now()))


def is_valid_session_cookie(cookie_value: Optional[str]) -> bool:
    if not cookie_value:
        return False
    value = _verify_signed(cookie_value)
    if value is None:
        return False
    try:
        created = int(value)
    except ValueError:
        return False
    return 0 <= (_now() - created) <= SESSION_TTL_SECONDS


async def require_server_auth(request: Request) -> None:
    if not SERVER_PASSWORD and not ALLOW_NO_PASSWORD:
        raise HTTPException(
            status_code=503,
            detail=(
                "TDWEB_SERVER_PASSWORD ist nicht gesetzt. Setze ein starkes Passwort "
                "oder starte bewusst mit TDWEB_ALLOW_NO_PASSWORD=1 nur im privaten Netz."
            ),
        )
    if ALLOW_NO_PASSWORD and not SERVER_PASSWORD:
        return
    if not is_valid_session_cookie(request.cookies.get(COOKIE_NAME)):
        raise HTTPException(status_code=401, detail="Nicht angemeldet")


def read_config() -> dict[str, Any]:
    if not CONFIG_PATH.exists():
        return {}
    try:
        data = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def write_config(config: dict[str, Any]) -> None:
    CONFIG_PATH.write_text(json.dumps(config, indent=2, ensure_ascii=False), encoding="utf-8")
    try:
        os.chmod(CONFIG_PATH, 0o600)
    except OSError:
        pass


def safe_filename(name: str) -> str:
    name = name.strip().replace("\\", "_").replace("/", "_")
    name = re.sub(r"[^A-Za-z0-9ÄÖÜäöüß._()\[\] -]+", "_", name)
    name = name.strip(" .")[:180]
    return name or "upload.bin"


def normalize_folder(folder: str | None) -> str:
    if not folder:
        return ""
    folder = str(folder).replace("\\", "/")
    folder = re.sub(r"[\x00-\x1f\x7f]+", "", folder)
    parts: list[str] = []
    for raw_part in folder.split("/"):
        part = raw_part.strip().strip(".")
        if not part:
            continue
        part = re.sub(r"\s+", " ", part)
        part = part[:80]
        if part:
            parts.append(part)
    return "/".join(parts[:16])


def expand_parent_paths(folder: str) -> list[str]:
    folder = normalize_folder(folder)
    if not folder:
        return []
    parts = folder.split("/")
    return ["/".join(parts[: idx + 1]) for idx in range(len(parts))]


def configured_folders() -> set[str]:
    config = read_config()
    raw = config.get("folders", [])
    if not isinstance(raw, list):
        return set()
    folders: set[str] = set()
    for value in raw:
        folders.update(expand_parent_paths(str(value)))
    return folders


def save_configured_folders(folders: set[str]) -> None:
    expanded: set[str] = set()
    for folder in folders:
        expanded.update(expand_parent_paths(folder))
    config = read_config()
    config["folders"] = sorted(expanded)
    write_config(config)


def remember_folder(folder: str) -> None:
    folder = normalize_folder(folder)
    if not folder:
        return
    folders = configured_folders()
    folders.update(expand_parent_paths(folder))
    save_configured_folders(folders)


def remove_configured_folder(folder: str, recursive: bool = False) -> None:
    folder = normalize_folder(folder)
    if not folder:
        return
    folders = configured_folders()
    if recursive:
        folders = {item for item in folders if item != folder and not item.startswith(folder + "/")}
    else:
        folders.discard(folder)
    save_configured_folders(folders)


def rename_configured_folder(old_folder: str, new_folder: str) -> None:
    old_folder = normalize_folder(old_folder)
    new_folder = normalize_folder(new_folder)
    if not old_folder or not new_folder:
        return
    folders = configured_folders()
    renamed: set[str] = set()
    for folder in folders:
        if folder == old_folder:
            renamed.add(new_folder)
        elif folder.startswith(old_folder + "/"):
            renamed.add(new_folder + folder[len(old_folder) :])
        else:
            renamed.add(folder)
    save_configured_folders(renamed)


def encode_meta(filename: str, folder: str = "") -> str:
    filename = safe_filename(filename)
    folder = normalize_folder(folder)
    payload = {
        "filename": filename,
        "folder": folder,
        "uploaded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "app": "telegram-drive-web",
    }
    raw = json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    encoded = base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")
    return f"{META_PREFIX}{encoded}\n{filename}"


def decode_meta(text: str | None) -> dict[str, Any]:
    if not text:
        return {}
    first_line = text.splitlines()[0].strip()
    if not first_line.startswith(META_PREFIX):
        return {}
    encoded = first_line[len(META_PREFIX) :]
    padding = "=" * (-len(encoded) % 4)
    try:
        raw = base64.urlsafe_b64decode((encoded + padding).encode("ascii"))
        payload = json.loads(raw.decode("utf-8"))
        if isinstance(payload, dict):
            payload["folder"] = normalize_folder(payload.get("folder", ""))
            if payload.get("filename"):
                payload["filename"] = safe_filename(str(payload["filename"]))
            return payload
    except Exception:
        return {}
    return {}


def file_category(name: str, mime_type: str | None) -> str:
    mime = (mime_type or "").lower()
    ext = Path(name).suffix.lower()
    if mime.startswith("image/"):
        return "image"
    if mime.startswith("video/"):
        return "video"
    if mime.startswith("audio/"):
        return "audio"
    if mime in {"application/pdf"} or ext == ".pdf":
        return "pdf"
    if ext in {".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz"}:
        return "archive"
    if ext in {".doc", ".docx", ".odt", ".rtf"}:
        return "document"
    if ext in {".xls", ".xlsx", ".csv", ".ods"}:
        return "spreadsheet"
    if ext in {".ppt", ".pptx", ".odp"}:
        return "presentation"
    if ext in {".txt", ".md", ".json", ".xml", ".yaml", ".yml", ".py", ".js", ".ts", ".html", ".css"}:
        return "text"
    return "file"

def normalize_search_text(value: Any) -> str:
    """Return a filesystem-like search string: case-insensitive, accent-insensitive, separator-tolerant."""
    text = str(value or "").casefold()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = re.sub(r"[\\/_\-.]+", " ", text)
    text = re.sub(r"[^\w]+", " ", text, flags=re.UNICODE)
    return re.sub(r"\s+", " ", text).strip()


def search_tokens(query: str) -> list[str]:
    normalized = normalize_search_text(query)
    return [token for token in normalized.split(" ") if token]


def file_search_haystack(item: dict[str, Any]) -> str:
    values = [
        item.get("name", ""),
        item.get("folder", ""),
        item.get("mime_type", ""),
        item.get("category", ""),
        item.get("extension", ""),
        Path(str(item.get("name", ""))).stem,
    ]
    return normalize_search_text(" ".join(str(value or "") for value in values))


def folder_search_haystack(folder: str) -> str:
    folder = normalize_folder(folder)
    name = folder.split("/")[-1] if folder else "Drive Root"
    return normalize_search_text(f"{folder} {name} folder ordner")


def matches_tokens(haystack: str, tokens: list[str]) -> bool:
    if not tokens:
        return True
    return all(token in haystack for token in tokens)


def matches_file_search(item: dict[str, Any], tokens: list[str]) -> bool:
    return matches_tokens(file_search_haystack(item), tokens)


def matches_folder_search(folder: str, tokens: list[str]) -> bool:
    return matches_tokens(folder_search_haystack(folder), tokens)


def item_in_folder_scope(item_folder: str, current_folder: str, recursive: bool = False) -> bool:
    item_folder = normalize_folder(item_folder)
    current_folder = normalize_folder(current_folder)
    if not current_folder:
        return True if recursive else item_folder == ""
    if recursive:
        return item_folder == current_folder or item_folder.startswith(current_folder + "/")
    return item_folder == current_folder


def folder_in_scope(folder: str, current_folder: str) -> bool:
    folder = normalize_folder(folder)
    current_folder = normalize_folder(current_folder)
    if not folder:
        return False
    if not current_folder:
        return True
    return folder == current_folder or folder.startswith(current_folder + "/")


def folder_info(folder: str, direct_counts: dict[str, int], descendant_counts: dict[str, int], all_folders: set[str]) -> dict[str, Any]:
    folder = normalize_folder(folder)
    return {
        "type": "folder",
        "name": folder.split("/")[-1] if folder else "Drive Root",
        "path": folder,
        "folder": folder,
        "direct_file_count": direct_counts.get(folder, 0),
        "descendant_file_count": descendant_counts.get(folder, 0),
        "has_children": any(candidate.startswith(folder + "/") for candidate in all_folders),
    }


def file_to_dict(message: Any) -> dict[str, Any]:
    meta = decode_meta(getattr(message, "raw_text", None))
    file_obj = getattr(message, "file", None)
    name = meta.get("filename")
    if not name and file_obj is not None:
        name = getattr(file_obj, "name", None)
    if not name:
        name = f"telegram-file-{message.id}"
    name = safe_filename(str(name))

    size = 0
    mime_type = None
    if file_obj is not None:
        size = getattr(file_obj, "size", 0) or 0
        mime_type = getattr(file_obj, "mime_type", None)
    if not mime_type:
        mime_type = mimetypes.guess_type(name)[0] or "application/octet-stream"

    date = getattr(message, "date", None)
    folder = normalize_folder(meta.get("folder", ""))
    return {
        "id": message.id,
        "name": name,
        "folder": folder,
        "size": size,
        "mime_type": mime_type,
        "category": file_category(name, mime_type),
        "date": date.isoformat() if date else None,
        "extension": Path(name).suffix.lower().lstrip("."),
        "is_tdweb": bool(meta),
    }


def child_folder_infos(all_folders: set[str], current_folder: str, direct_counts: dict[str, int], descendant_counts: dict[str, int]) -> list[dict[str, Any]]:
    current_folder = normalize_folder(current_folder)
    children: dict[str, dict[str, Any]] = {}
    prefix = f"{current_folder}/" if current_folder else ""
    for folder in sorted(all_folders):
        if current_folder:
            if not folder.startswith(prefix):
                continue
            rest = folder[len(prefix) :]
        else:
            rest = folder
        if not rest:
            continue
        segment = rest.split("/", 1)[0]
        path = f"{prefix}{segment}" if prefix else segment
        if path not in children:
            children[path] = {
                "type": "folder",
                "name": segment,
                "path": path,
                "folder": path,
                "direct_file_count": direct_counts.get(path, 0),
                "descendant_file_count": descendant_counts.get(path, 0),
                "has_children": any(candidate.startswith(path + "/") for candidate in all_folders),
            }
    return list(children.values())


class ServerLoginRequest(BaseModel):
    password: str = Field(default="")


class TelegramStartRequest(BaseModel):
    api_id: int
    api_hash: str
    phone: str


class TelegramVerifyRequest(BaseModel):
    code: str


class TelegramPasswordRequest(BaseModel):
    password: str


class FolderCreateRequest(BaseModel):
    folder: str


class FolderRenameRequest(BaseModel):
    old_folder: str
    new_folder: str


class FileMetaUpdateRequest(BaseModel):
    name: Optional[str] = None
    folder: Optional[str] = None


@dataclass
class TelegramRuntime:
    client: Optional[TelegramClient] = None
    api_id: Optional[int] = None
    api_hash: Optional[str] = None
    phone: Optional[str] = None
    phone_code_hash: Optional[str] = None


class TelegramManager:
    def __init__(self) -> None:
        self._runtime = TelegramRuntime()
        self._lock = asyncio.Lock()

    async def get_client(self, require_authorized: bool = True) -> TelegramClient:
        async with self._lock:
            client = await self._ensure_client_locked()
            if require_authorized and not await client.is_user_authorized():
                raise HTTPException(status_code=401, detail="Telegram ist noch nicht angemeldet")
            return client

    async def _ensure_client_locked(self) -> TelegramClient:
        if self._runtime.client and self._runtime.client.is_connected():
            return self._runtime.client

        config = read_config()
        api_id = self._runtime.api_id or config.get("api_id")
        api_hash = self._runtime.api_hash or config.get("api_hash")
        phone = self._runtime.phone or config.get("phone")
        if not api_id or not api_hash:
            raise HTTPException(status_code=401, detail="Telegram API-Daten fehlen")

        client = TelegramClient(str(SESSION_PATH), int(api_id), str(api_hash))
        await client.connect()
        self._runtime.client = client
        self._runtime.api_id = int(api_id)
        self._runtime.api_hash = str(api_hash)
        self._runtime.phone = str(phone) if phone else None
        return client

    async def status(self) -> dict[str, Any]:
        try:
            client = await self.get_client(require_authorized=False)
            authorized = await client.is_user_authorized()
            me = None
            if authorized:
                user = await client.get_me()
                me = {
                    "id": user.id,
                    "first_name": getattr(user, "first_name", None),
                    "last_name": getattr(user, "last_name", None),
                    "username": getattr(user, "username", None),
                    "phone": getattr(user, "phone", None),
                }
            return {"authorized": authorized, "me": me}
        except HTTPException:
            return {"authorized": False, "me": None}
        except Exception as exc:
            return {"authorized": False, "me": None, "error": str(exc)}

    async def start_login(self, api_id: int, api_hash: str, phone: str) -> dict[str, Any]:
        async with self._lock:
            if self._runtime.client:
                try:
                    await self._runtime.client.disconnect()
                except Exception:
                    pass
            self._runtime = TelegramRuntime(api_id=api_id, api_hash=api_hash.strip(), phone=phone.strip())
            config = read_config()
            config.update({"api_id": api_id, "api_hash": api_hash.strip(), "phone": phone.strip()})
            write_config(config)
            client = TelegramClient(str(SESSION_PATH), int(api_id), api_hash.strip())
            await client.connect()
            self._runtime.client = client
            sent = await client.send_code_request(phone.strip())
            self._runtime.phone_code_hash = sent.phone_code_hash
            return {"ok": True, "next_step": "code"}

    async def verify_code(self, code: str) -> dict[str, Any]:
        async with self._lock:
            client = await self._ensure_client_locked()
            if not self._runtime.phone:
                config = read_config()
                self._runtime.phone = config.get("phone")
            if not self._runtime.phone or not self._runtime.phone_code_hash:
                raise HTTPException(status_code=400, detail="Kein aktiver Login-Vorgang. Starte den Login neu.")
            try:
                await client.sign_in(
                    phone=self._runtime.phone,
                    code=code.strip(),
                    phone_code_hash=self._runtime.phone_code_hash,
                )
                return {"ok": True, "next_step": "dashboard"}
            except SessionPasswordNeededError:
                return {"ok": False, "next_step": "password"}
            except PhoneCodeInvalidError:
                raise HTTPException(status_code=400, detail="Der Telegram-Code ist ungültig")
            except PhoneCodeExpiredError:
                raise HTTPException(status_code=400, detail="Der Telegram-Code ist abgelaufen. Starte den Login neu.")

    async def verify_password(self, password: str) -> dict[str, Any]:
        async with self._lock:
            client = await self._ensure_client_locked()
            await client.sign_in(password=password)
            return {"ok": True, "next_step": "dashboard"}

    async def logout(self) -> None:
        async with self._lock:
            if self._runtime.client:
                try:
                    await self._runtime.client.log_out()
                except Exception:
                    try:
                        await self._runtime.client.disconnect()
                    except Exception:
                        pass
            self._runtime = TelegramRuntime()
            for path in DATA_DIR.glob("telegram.session*"):
                try:
                    path.unlink()
                except OSError:
                    pass


manager = TelegramManager()
app = FastAPI(title=APP_NAME, version=APP_VERSION)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/")
async def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/api/health")
async def health() -> dict[str, Any]:
    return {"status": "ok", "app": APP_NAME, "version": APP_VERSION}


@app.get("/api/status")
async def status(request: Request) -> dict[str, Any]:
    server_auth_configured = bool(SERVER_PASSWORD) or ALLOW_NO_PASSWORD
    server_authenticated = ALLOW_NO_PASSWORD and not SERVER_PASSWORD
    if SERVER_PASSWORD:
        server_authenticated = is_valid_session_cookie(request.cookies.get(COOKIE_NAME))
    telegram = {"authorized": False, "me": None}
    if server_authenticated:
        telegram = await manager.status()
    return {
        "server_auth_configured": server_auth_configured,
        "server_authenticated": server_authenticated,
        "telegram": telegram,
        "version": APP_VERSION,
    }


@app.post("/api/server/login")
async def server_login(payload: ServerLoginRequest, response: Response) -> dict[str, Any]:
    if not SERVER_PASSWORD and ALLOW_NO_PASSWORD:
        return {"ok": True}
    if not SERVER_PASSWORD:
        raise HTTPException(status_code=503, detail="TDWEB_SERVER_PASSWORD fehlt")
    if not hmac.compare_digest(payload.password, SERVER_PASSWORD):
        raise HTTPException(status_code=401, detail="Falsches Passwort")
    response.set_cookie(
        COOKIE_NAME,
        make_session_cookie(),
        max_age=SESSION_TTL_SECONDS,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
    )
    return {"ok": True}


@app.post("/api/server/logout")
async def server_logout(response: Response) -> dict[str, Any]:
    response.delete_cookie(COOKIE_NAME)
    return {"ok": True}


@app.post("/api/telegram/start", dependencies=[Depends(require_server_auth)])
async def telegram_start(payload: TelegramStartRequest) -> dict[str, Any]:
    if not payload.api_hash.strip():
        raise HTTPException(status_code=400, detail="API Hash fehlt")
    if not payload.phone.strip():
        raise HTTPException(status_code=400, detail="Telefonnummer fehlt")
    return await manager.start_login(payload.api_id, payload.api_hash, payload.phone)


@app.post("/api/telegram/verify", dependencies=[Depends(require_server_auth)])
async def telegram_verify(payload: TelegramVerifyRequest) -> dict[str, Any]:
    return await manager.verify_code(payload.code)


@app.post("/api/telegram/password", dependencies=[Depends(require_server_auth)])
async def telegram_password(payload: TelegramPasswordRequest) -> dict[str, Any]:
    return await manager.verify_password(payload.password)


@app.post("/api/telegram/logout", dependencies=[Depends(require_server_auth)])
async def telegram_logout() -> dict[str, Any]:
    await manager.logout()
    return {"ok": True}


@app.get("/api/explorer", dependencies=[Depends(require_server_auth)])
async def explorer(
    folder: str = "",
    scope: str = Query(default="folder", pattern="^(folder|all)$"),
    limit: int = 80,
    offset_id: int = 0,
    search: str = "",
    scan_limit: int = DEFAULT_SCAN_LIMIT,
) -> dict[str, Any]:
    """Return Explorer data.

    Search is intentionally performed locally over scanned Telegram messages instead of
    relying on Telegram's server-side search. This makes filename/folder search behave
    like a file explorer: case-insensitive, separator-tolerant and independent from
    Telegram caption search quirks.
    """
    limit = max(1, min(limit, 200))
    current_folder = normalize_folder(folder)
    query = search.strip()
    tokens = search_tokens(query)
    requested_scan_limit = max(1, min(scan_limit, MAX_SCAN_LIMIT))
    if tokens:
        requested_scan_limit = max(requested_scan_limit, min(SEARCH_SCAN_LIMIT, MAX_SCAN_LIMIT))
    requested_scan_limit = max(limit, requested_scan_limit)

    client = await manager.get_client(require_authorized=True)
    all_folders: set[str] = set(configured_folders())
    files: list[dict[str, Any]] = []
    direct_counts: dict[str, int] = {}
    descendant_counts: dict[str, int] = {}
    categories: dict[str, int] = {}
    next_offset_id = 0
    scanned = 0

    async for message in client.iter_messages("me", limit=requested_scan_limit, offset_id=offset_id or 0):
        next_offset_id = message.id
        scanned += 1
        if getattr(message, "file", None) is None:
            continue
        item = file_to_dict(message)
        item_folder = normalize_folder(item.get("folder", ""))
        item["folder"] = item_folder
        if item_folder:
            all_folders.update(expand_parent_paths(item_folder))
            direct_counts[item_folder] = direct_counts.get(item_folder, 0) + 1
            for parent in expand_parent_paths(item_folder):
                descendant_counts[parent] = descendant_counts.get(parent, 0) + 1
        categories[item["category"]] = categories.get(item["category"], 0) + 1

        if tokens and not matches_file_search(item, tokens):
            continue

        if scope == "folder":
            # Normal folder browsing shows direct children. Search behaves like a file
            # explorer and searches the whole current folder subtree.
            in_scope = item_in_folder_scope(item_folder, current_folder, recursive=bool(tokens))
        else:
            in_scope = True

        if in_scope and len(files) < limit:
            files.append(item)

    if tokens:
        folders = [
            folder_info(path, direct_counts, descendant_counts, all_folders)
            for path in sorted(all_folders)
            if (scope == "all" or folder_in_scope(path, current_folder)) and matches_folder_search(path, tokens)
        ][:200]
    else:
        folders = child_folder_infos(all_folders, current_folder if scope == "folder" else "", direct_counts, descendant_counts)

    return {
        "folder": current_folder,
        "scope": scope,
        "search": query,
        "files": files,
        "folders": folders,
        "all_folders": sorted(all_folders),
        "next_offset_id": next_offset_id,
        "has_more": bool(next_offset_id and scanned >= requested_scan_limit),
        "limit": limit,
        "scanned": scanned,
        "scan_limit": requested_scan_limit,
        "categories": categories,
    }


@app.get("/api/files", dependencies=[Depends(require_server_auth)])
async def list_files(
    limit: int = 50,
    offset_id: int = 0,
    search: str = "",
    folder: str = "",
    scan_limit: int = DEFAULT_SCAN_LIMIT,
) -> dict[str, Any]:
    limit = max(1, min(limit, 200))
    current_folder = normalize_folder(folder)
    tokens = search_tokens(search)
    requested_scan_limit = max(limit, min(max(1, scan_limit), MAX_SCAN_LIMIT))
    if tokens:
        requested_scan_limit = max(requested_scan_limit, min(SEARCH_SCAN_LIMIT, MAX_SCAN_LIMIT))
    client = await manager.get_client(require_authorized=True)
    items: list[dict[str, Any]] = []
    next_offset_id = 0
    scanned = 0
    async for message in client.iter_messages("me", limit=requested_scan_limit, offset_id=offset_id or 0):
        next_offset_id = message.id
        scanned += 1
        if getattr(message, "file", None) is None:
            continue
        item = file_to_dict(message)
        item_folder = normalize_folder(item.get("folder", ""))
        if current_folder and not item_in_folder_scope(item_folder, current_folder, recursive=bool(tokens)):
            continue
        if tokens and not matches_file_search(item, tokens):
            continue
        if len(items) < limit:
            items.append(item)
    return {
        "items": items,
        "next_offset_id": next_offset_id,
        "limit": limit,
        "scanned": scanned,
        "has_more": bool(next_offset_id and scanned >= requested_scan_limit),
    }


@app.get("/api/folders", dependencies=[Depends(require_server_auth)])
async def list_folders(limit: int = 1000) -> dict[str, Any]:
    limit = max(1, min(limit, 10000))
    client = await manager.get_client(require_authorized=True)
    folders: set[str] = set(configured_folders())
    async for message in client.iter_messages("me", limit=limit):
        if getattr(message, "file", None) is None:
            continue
        item = file_to_dict(message)
        folder = normalize_folder(item.get("folder", ""))
        if folder:
            folders.update(expand_parent_paths(folder))
    return {"folders": sorted(folders)}


@app.post("/api/folders", dependencies=[Depends(require_server_auth)])
async def create_folder(payload: FolderCreateRequest) -> dict[str, Any]:
    folder = normalize_folder(payload.folder)
    if not folder:
        raise HTTPException(status_code=400, detail="Ordnername fehlt")
    remember_folder(folder)
    return {"ok": True, "folder": folder}


@app.patch("/api/folders/rename", dependencies=[Depends(require_server_auth)])
async def rename_folder(payload: FolderRenameRequest, scan_limit: int = DEFAULT_SCAN_LIMIT) -> dict[str, Any]:
    old_folder = normalize_folder(payload.old_folder)
    new_folder = normalize_folder(payload.new_folder)
    if not old_folder or not new_folder:
        raise HTTPException(status_code=400, detail="Alter und neuer Ordner sind erforderlich")
    if old_folder == new_folder:
        return {"ok": True, "updated": 0, "folder": new_folder}
    if new_folder.startswith(old_folder + "/"):
        raise HTTPException(status_code=400, detail="Ein Ordner kann nicht in sich selbst verschoben werden")

    scan_limit = max(1, min(scan_limit, MAX_SCAN_LIMIT))
    client = await manager.get_client(require_authorized=True)
    updated = 0
    async for message in client.iter_messages("me", limit=scan_limit):
        if getattr(message, "file", None) is None:
            continue
        item = file_to_dict(message)
        current = normalize_folder(item.get("folder", ""))
        if current == old_folder or current.startswith(old_folder + "/"):
            suffix = current[len(old_folder) :]
            target_folder = normalize_folder(new_folder + suffix)
            await client.edit_message("me", message.id, text=encode_meta(item["name"], target_folder))
            updated += 1
    rename_configured_folder(old_folder, new_folder)
    remember_folder(new_folder)
    return {"ok": True, "updated": updated, "folder": new_folder}


@app.delete("/api/folders", dependencies=[Depends(require_server_auth)])
async def delete_folder(folder: str, recursive: bool = False, scan_limit: int = DEFAULT_SCAN_LIMIT) -> dict[str, Any]:
    target = normalize_folder(folder)
    if not target:
        raise HTTPException(status_code=400, detail="Ordner fehlt")
    scan_limit = max(1, min(scan_limit, MAX_SCAN_LIMIT))
    client = await manager.get_client(require_authorized=True)
    file_count = 0
    async for message in client.iter_messages("me", limit=scan_limit):
        if getattr(message, "file", None) is None:
            continue
        item = file_to_dict(message)
        current = normalize_folder(item.get("folder", ""))
        if current == target or current.startswith(target + "/"):
            file_count += 1
            if not recursive:
                break
    if file_count and not recursive:
        raise HTTPException(status_code=409, detail="Der Ordner enthält noch Dateien. Verschiebe oder lösche sie zuerst.")
    remove_configured_folder(target, recursive=True)
    return {"ok": True, "folder": target, "removed_from_registry": True, "files_found": file_count}


@app.post("/api/upload", dependencies=[Depends(require_server_auth)])
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Form(default=""),
) -> dict[str, Any]:
    client = await manager.get_client(require_authorized=True)
    original_name = safe_filename(file.filename or "upload.bin")
    folder = normalize_folder(folder)
    if folder:
        remember_folder(folder)
    tmp_dir = Path(tempfile.mkdtemp(prefix="upload_", dir=UPLOAD_TMP_DIR))
    tmp_path = tmp_dir / original_name
    try:
        with tmp_path.open("wb") as out:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                out.write(chunk)
        caption = encode_meta(original_name, folder)
        message = await client.send_file("me", str(tmp_path), caption=caption, force_document=True)
        return {"ok": True, "file": file_to_dict(message)}
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


@app.patch("/api/files/{message_id}/meta", dependencies=[Depends(require_server_auth)])
async def update_file_meta(message_id: int, payload: FileMetaUpdateRequest) -> dict[str, Any]:
    client = await manager.get_client(require_authorized=True)
    messages = await client.get_messages("me", ids=message_id)
    message = messages[0] if isinstance(messages, list) else messages
    if not message or getattr(message, "file", None) is None:
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    item = file_to_dict(message)
    new_name = safe_filename(payload.name) if payload.name is not None and payload.name.strip() else item["name"]
    new_folder = normalize_folder(payload.folder if payload.folder is not None else item.get("folder", ""))
    if new_folder:
        remember_folder(new_folder)
    await client.edit_message("me", message_id, text=encode_meta(new_name, new_folder))
    updated = await client.get_messages("me", ids=message_id)
    updated_message = updated[0] if isinstance(updated, list) else updated
    return {"ok": True, "file": file_to_dict(updated_message)}


async def cached_media_file(message_id: int) -> tuple[Path, dict[str, Any]]:
    client = await manager.get_client(require_authorized=True)
    messages = await client.get_messages("me", ids=message_id)
    message = messages[0] if isinstance(messages, list) else messages
    if not message or getattr(message, "file", None) is None:
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")
    item = file_to_dict(message)
    name = safe_filename(item["name"])
    target = DOWNLOAD_CACHE_DIR / f"{message_id}_{name}"
    if not target.exists() or target.stat().st_size == 0:
        await client.download_media(message, file=str(target))
    return target, item


def iter_file_range(path: Path, start: int, end: int, chunk_size: int = 1024 * 1024):
    with path.open("rb") as handle:
        handle.seek(start)
        remaining = end - start + 1
        while remaining > 0:
            chunk = handle.read(min(chunk_size, remaining))
            if not chunk:
                break
            remaining -= len(chunk)
            yield chunk


def inline_disposition(filename: str) -> str:
    ascii_name = safe_filename(filename).replace('"', "_")
    return f'inline; filename="{ascii_name}"; filename*=UTF-8\'\'{quote(filename)}'


@app.get("/api/files/{message_id}/preview", dependencies=[Depends(require_server_auth)])
async def preview_file(message_id: int, request: Request) -> StreamingResponse:
    target, item = await cached_media_file(message_id)
    media_type = item.get("mime_type") or "application/octet-stream"
    filename = safe_filename(item["name"])
    file_size = target.stat().st_size
    headers = {
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=3600",
        "Content-Disposition": inline_disposition(filename),
    }

    range_header = request.headers.get("range") or request.headers.get("Range")
    if range_header and range_header.startswith("bytes="):
        raw_range = range_header.replace("bytes=", "", 1).split(",", 1)[0].strip()
        start_text, _, end_text = raw_range.partition("-")
        try:
            if start_text == "":
                suffix_length = int(end_text)
                start = max(file_size - suffix_length, 0)
                end = file_size - 1
            else:
                start = int(start_text)
                end = int(end_text) if end_text else file_size - 1
            if start < 0 or end < start or start >= file_size:
                return Response(status_code=416, headers={"Content-Range": f"bytes */{file_size}"})
            end = min(end, file_size - 1)
        except ValueError:
            return Response(status_code=416, headers={"Content-Range": f"bytes */{file_size}"})

        headers.update({
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Content-Length": str(end - start + 1),
        })
        return StreamingResponse(iter_file_range(target, start, end), status_code=206, media_type=media_type, headers=headers)

    headers["Content-Length"] = str(file_size)
    return StreamingResponse(iter_file_range(target, 0, max(file_size - 1, 0)), media_type=media_type, headers=headers)


@app.get("/api/files/{message_id}/download", dependencies=[Depends(require_server_auth)])
async def download_file(message_id: int) -> FileResponse:
    target, item = await cached_media_file(message_id)
    name = safe_filename(item["name"])
    media_type = item.get("mime_type") or "application/octet-stream"
    return FileResponse(str(target), media_type=media_type, filename=name)


@app.delete("/api/files/{message_id}", dependencies=[Depends(require_server_auth)])
async def delete_file(message_id: int) -> dict[str, Any]:
    client = await manager.get_client(require_authorized=True)
    await client.delete_messages("me", [message_id])
    for cache_file in DOWNLOAD_CACHE_DIR.glob(f"{message_id}_*"):
        try:
            cache_file.unlink()
        except OSError:
            pass
    return {"ok": True}


@app.get("/api/stats", dependencies=[Depends(require_server_auth)])
async def stats(scan_limit: int = DEFAULT_SCAN_LIMIT) -> dict[str, Any]:
    scan_limit = max(1, min(scan_limit, MAX_SCAN_LIMIT))
    client = await manager.get_client(require_authorized=True)
    total_files = 0
    total_size = 0
    folders: set[str] = set(configured_folders())
    categories: dict[str, int] = {}
    recent: list[dict[str, Any]] = []
    async for message in client.iter_messages("me", limit=scan_limit):
        if getattr(message, "file", None) is None:
            continue
        item = file_to_dict(message)
        total_files += 1
        total_size += int(item.get("size") or 0)
        folder = normalize_folder(item.get("folder", ""))
        if folder:
            folders.update(expand_parent_paths(folder))
        category = item.get("category", "file")
        categories[category] = categories.get(category, 0) + 1
        if len(recent) < 5:
            recent.append(item)
    return {
        "total_files": total_files,
        "total_size": total_size,
        "folders": len(folders),
        "categories": categories,
        "recent": recent,
        "scanned": scan_limit,
    }


@app.post("/api/cache/clear", dependencies=[Depends(require_server_auth)])
async def clear_cache() -> dict[str, Any]:
    count = 0
    for cache_file in DOWNLOAD_CACHE_DIR.glob("*"):
        if cache_file.is_file():
            try:
                cache_file.unlink()
                count += 1
            except OSError:
                pass
    return {"ok": True, "deleted": count}


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return _json_response({"error": exc.detail}, status_code=exc.status_code)


@app.exception_handler(Exception)
async def exception_handler(_: Request, exc: Exception) -> JSONResponse:
    return _json_response({"error": str(exc)}, status_code=500)

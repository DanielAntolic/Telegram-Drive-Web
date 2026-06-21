const $ = (id) => document.getElementById(id);
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const I18N = {
  de: {
    setupWarningTitle: 'Server-Passwort fehlt',
    setupWarningText: 'Setze TDWEB_SERVER_PASSWORD in deiner .env und starte den Container neu.',
    linuxEdition: 'Linux Server Edition',
    unlockIntro: 'Entsperre deine private Dateioberfläche.',
    webPassword: 'Web-Passwort',
    webPasswordPlaceholder: 'Passwort eingeben',
    login: 'Einloggen',
    connectTelegram: 'Telegram verbinden',
    telegramLoginTitle: 'Einmaliger Telegram Login',
    telegramLoginIntro: 'Du brauchst deine API ID und deinen API Hash von',
    phoneWithCountry: 'Telefonnummer mit Ländercode',
    requestCode: 'Code anfordern',
    telegramCode: 'Telegram-Code',
    confirmCode: 'Code bestätigen',
    twoFaPassword: '2FA-Passwort',
    confirmTwoFa: '2FA bestätigen',
    quickAccess: 'Schnellzugriff',
    allFiles: 'Alle Dateien',
    driveRoot: 'Drive Root',
    folders: 'Ordner',
    folder: 'Ordner',
    newFolder: 'Neuer Ordner',
    connected: 'Verbunden',
    telegramConnected: 'Telegram verbunden',
    telegramLogout: 'Telegram ausloggen',
    webLogout: 'Web-Logout',
    openSidebar: 'Sidebar öffnen',
    searchCurrent: 'Dateien suchen',
    searchAll: 'Alle Dateien durchsuchen',
    searchRoot: 'Im Drive Root suchen',
    searchInFolder: 'In {folder} suchen',
    clearSearch: 'Suche löschen',
    refresh: 'Aktualisieren',
    upload: 'Hochladen',
    files: 'Dateien',
    scanned: 'gescannt',
    storage: 'Speicher',
    inTelegram: 'in Telegram',
    virtual: 'virtuell',
    dropFilesHere: 'Dateien hier ablegen',
    uploadCurrentFolder: 'Upload in den aktuellen Ordner',
    choose: 'Auswählen',
    wholeDrive: 'Gesamter Telegram Drive',
    currentFolder: 'Aktueller Ordner',
    myFiles: 'Meine Dateien',
    loading: 'Wird geladen …',
    loadingFiles: 'Dateien werden geladen …',
    emptyTitle: 'Dieser Bereich ist leer',
    emptyText: 'Lade eine Datei hoch oder erstelle einen virtuellen Ordner.',
    emptySearchTitle: 'Keine Treffer gefunden',
    emptySearchText: 'Versuche einen kürzeren Suchbegriff oder suche in „Alle Dateien“.',
    uploadFile: 'Datei hochladen',
    name: 'Name',
    size: 'Größe',
    date: 'Datum',
    actions: 'Aktionen',
    loadMore: 'Mehr laden',
    sort: 'Sortieren',
    sortDateDesc: 'Neueste zuerst',
    sortDateAsc: 'Älteste zuerst',
    sortNameAsc: 'Name A–Z',
    sortNameDesc: 'Name Z–A',
    sortSizeDesc: 'Größe absteigend',
    sortSizeAsc: 'Größe aufsteigend',
    view: 'Ansicht',
    list: 'Liste',
    tiles: 'Kacheln',
    uploadFiles: 'Dateien hochladen',
    targetFolder: 'Zielordner',
    folderPlaceholder: 'z.B. Dokumente/FOM',
    cancel: 'Abbrechen',
    nameOrPath: 'Name oder Pfad',
    create: 'Erstellen',
    edit: 'Bearbeiten',
    rename: 'Umbenennen',
    renameFolder: 'Ordner umbenennen',
    renameFile: 'Datei umbenennen / verschieben',
    editFolder: 'Ordner bearbeiten',
    editFile: 'Datei bearbeiten',
    folderPath: 'Ordnerpfad',
    save: 'Speichern',
    preview: 'Vorschau',
    viewFile: 'Datei ansehen',
    previewLoading: 'Vorschau wird geladen …',
    openNewTab: 'In neuem Tab öffnen',
    download: 'Download',
    noPreview: 'Für diese Datei gibt es keine Browser-Vorschau.',
    open: 'Öffnen',
    delete: 'Löschen',
    file: 'Datei',
    folderType: 'Virtueller Ordner',
    totalFiles: '{count} Datei(en) insgesamt',
    directFiles: '{count} direkt',
    folderFiles: '{count} Datei(en)',
    itemSummary: '{folders} Ordner · {files} Datei(en)',
    searchSummary: 'Suche „{query}“ · {folders} Ordner · {files} Datei(en)',
    searchHintAll: 'Suche ignoriert Groß-/Kleinschreibung und findet Namen, Ordner, Endungen und Typen.',
    searchHintFolder: 'Suche in diesem Ordner inklusive Unterordnern. Groß-/Kleinschreibung ist egal.',
    details: 'Details',
    detailsEmpty: 'Wähle eine Datei oder einen Ordner aus.',
    type: 'Typ',
    path: 'Pfad',
    total: 'insgesamt',
    directly: 'direkt',
    openFolder: 'Ordner öffnen',
    viewPlay: 'Ansehen / Abspielen',
    moveRename: 'Umbenennen / Verschieben',
    pleaseWait: 'Bitte warten …',
    requestingCode: 'Code wird angefordert …',
    checkingCode: 'Prüfe Code …',
    checkingTwoFa: 'Prüfe 2FA …',
    uploading: 'Upload läuft …',
    creating: 'Erstelle …',
    saving: 'Speichere …',
    unlocked: 'Weboberfläche entsperrt',
    codeRequested: 'Telegram-Code wurde angefordert',
    twoFaRequired: '2FA-Passwort erforderlich',
    updated: 'Aktualisiert',
    uploadDone: 'Upload abgeschlossen',
    folderCreated: 'Ordner erstellt',
    saved: 'Gespeichert',
    fileDeleted: 'Datei gelöscht',
    folderRemoved: 'Ordner entfernt',
    noFileSelected: 'Keine Datei ausgewählt',
    uploadFailed: 'Upload fehlgeschlagen',
    confirmTelegramLogout: 'Telegram-Session auf diesem Server wirklich abmelden?',
    confirmDeleteFile: 'Datei wirklich löschen?\n\n{name}',
    confirmDeleteFolder: 'Leeren virtuellen Ordner entfernen?\n\n{path}\n\nDateien werden nicht gelöscht. Der Ordner kann nur entfernt werden, wenn er leer ist.',
    previewable: 'Vorschau',
    root: 'Drive Root',
  },
  en: {
    setupWarningTitle: 'Server password missing',
    setupWarningText: 'Set TDWEB_SERVER_PASSWORD in your .env file and restart the container.',
    linuxEdition: 'Linux Server Edition',
    unlockIntro: 'Unlock your private file interface.',
    webPassword: 'Web password',
    webPasswordPlaceholder: 'Enter password',
    login: 'Log in',
    connectTelegram: 'Connect Telegram',
    telegramLoginTitle: 'One-time Telegram login',
    telegramLoginIntro: 'You need your API ID and API Hash from',
    phoneWithCountry: 'Phone number with country code',
    requestCode: 'Request code',
    telegramCode: 'Telegram code',
    confirmCode: 'Confirm code',
    twoFaPassword: '2FA password',
    confirmTwoFa: 'Confirm 2FA',
    quickAccess: 'Quick access',
    allFiles: 'All files',
    driveRoot: 'Drive Root',
    folders: 'Folders',
    folder: 'Folder',
    newFolder: 'New folder',
    connected: 'Connected',
    telegramConnected: 'Telegram connected',
    telegramLogout: 'Log out Telegram',
    webLogout: 'Web logout',
    openSidebar: 'Open sidebar',
    searchCurrent: 'Search files',
    searchAll: 'Search all files',
    searchRoot: 'Search Drive Root',
    searchInFolder: 'Search in {folder}',
    clearSearch: 'Clear search',
    refresh: 'Refresh',
    upload: 'Upload',
    files: 'Files',
    scanned: 'scanned',
    storage: 'Storage',
    inTelegram: 'in Telegram',
    virtual: 'virtual',
    dropFilesHere: 'Drop files here',
    uploadCurrentFolder: 'Upload to the current folder',
    choose: 'Choose',
    wholeDrive: 'Entire Telegram Drive',
    currentFolder: 'Current folder',
    myFiles: 'My files',
    loading: 'Loading …',
    loadingFiles: 'Loading files …',
    emptyTitle: 'This area is empty',
    emptyText: 'Upload a file or create a virtual folder.',
    emptySearchTitle: 'No results found',
    emptySearchText: 'Try a shorter query or search in “All files”.',
    uploadFile: 'Upload file',
    name: 'Name',
    size: 'Size',
    date: 'Date',
    actions: 'Actions',
    loadMore: 'Load more',
    sort: 'Sort',
    sortDateDesc: 'Newest first',
    sortDateAsc: 'Oldest first',
    sortNameAsc: 'Name A–Z',
    sortNameDesc: 'Name Z–A',
    sortSizeDesc: 'Size descending',
    sortSizeAsc: 'Size ascending',
    view: 'View',
    list: 'List',
    tiles: 'Tiles',
    uploadFiles: 'Upload files',
    targetFolder: 'Target folder',
    folderPlaceholder: 'e.g. Documents/FOM',
    cancel: 'Cancel',
    nameOrPath: 'Name or path',
    create: 'Create',
    edit: 'Edit',
    rename: 'Rename',
    renameFolder: 'Rename folder',
    renameFile: 'Rename / move file',
    editFolder: 'Edit folder',
    editFile: 'Edit file',
    folderPath: 'Folder path',
    save: 'Save',
    preview: 'Preview',
    viewFile: 'View file',
    previewLoading: 'Loading preview …',
    openNewTab: 'Open in new tab',
    download: 'Download',
    noPreview: 'No browser preview is available for this file.',
    open: 'Open',
    delete: 'Delete',
    file: 'File',
    folderType: 'Virtual folder',
    totalFiles: '{count} file(s) total',
    directFiles: '{count} direct',
    folderFiles: '{count} file(s)',
    itemSummary: '{folders} folders · {files} file(s)',
    searchSummary: 'Search “{query}” · {folders} folders · {files} file(s)',
    searchHintAll: 'Search ignores letter case and matches names, folders, extensions and file types.',
    searchHintFolder: 'Search in this folder including subfolders. Letter case is ignored.',
    details: 'Details',
    detailsEmpty: 'Select a file or folder.',
    type: 'Type',
    path: 'Path',
    total: 'total',
    directly: 'direct',
    openFolder: 'Open folder',
    viewPlay: 'View / Play',
    moveRename: 'Rename / Move',
    pleaseWait: 'Please wait …',
    requestingCode: 'Requesting code …',
    checkingCode: 'Checking code …',
    checkingTwoFa: 'Checking 2FA …',
    uploading: 'Uploading …',
    creating: 'Creating …',
    saving: 'Saving …',
    unlocked: 'Web interface unlocked',
    codeRequested: 'Telegram code requested',
    twoFaRequired: '2FA password required',
    updated: 'Updated',
    uploadDone: 'Upload complete',
    folderCreated: 'Folder created',
    saved: 'Saved',
    fileDeleted: 'File deleted',
    folderRemoved: 'Folder removed',
    noFileSelected: 'No file selected',
    uploadFailed: 'Upload failed',
    confirmTelegramLogout: 'Really log out the Telegram session on this server?',
    confirmDeleteFile: 'Really delete this file?\n\n{name}',
    confirmDeleteFolder: 'Remove this empty virtual folder?\n\n{path}\n\nFiles are not deleted. The folder can only be removed when it is empty.',
    previewable: 'Preview',
    root: 'Drive Root',
  },
};

const state = {
  initialized: false,
  loading: false,
  pendingReload: false,
  pendingReset: false,
  requestSeq: 0,
  scope: 'all',
  currentFolder: '',
  files: [],
  folders: [],
  allFolders: [],
  nextOffsetId: 0,
  hasMore: false,
  selected: null,
  view: localStorage.getItem('tdweb:view') || 'list',
  lang: localStorage.getItem('tdweb:lang') || ((navigator.language || 'de').toLowerCase().startsWith('en') ? 'en' : 'de'),
  renameTarget: null,
  status: null,
  stats: null,
  lastSearch: '',
};
state.lang = state.lang === 'en' ? 'en' : 'de';

function t(key, vars = {}) {
  const dict = I18N[state.lang] || I18N.de;
  let value = dict[key] || I18N.de[key] || key;
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replaceAll(`{${name}}`, String(replacement));
  }
  return value;
}

function show(id, visible) {
  const el = $(id);
  if (el) el.classList.toggle('hidden', !visible);
}

function applyI18n() {
  document.documentElement.lang = state.lang;
  qsa('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  qsa('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  qsa('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  qsa('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
  qsa('[data-language-select]').forEach((select) => {
    select.value = state.lang;
  });
  setTitle();
  renderBreadcrumbs();
  renderExplorer();
  renderDetails();
}

function toast(message, isError = false) {
  const host = $('toastHost');
  const node = document.createElement('div');
  node.className = `toast${isError ? ' error' : ''}`;
  node.textContent = message;
  host.appendChild(node);
  setTimeout(() => {
    node.style.opacity = '0';
    node.style.transform = 'translateY(8px)';
    setTimeout(() => node.remove(), 180);
  }, 4200);
}

async function api(path, options = {}) {
  const headers = options.headers ? { ...options.headers } : {};
  const hasBody = options.body !== undefined && !(options.body instanceof FormData);
  if (hasBody && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  const res = await fetch(path, { credentials: 'same-origin', ...options, headers });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const message = typeof data === 'object' && data && data.error ? data.error : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

function formatBytes(bytes) {
  bytes = Number(bytes || 0);
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
}

function formatDate(value) {
  if (!value) return '–';
  try {
    return new Date(value).toLocaleString(state.lang === 'en' ? 'en-US' : 'de-DE', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return value;
  }
}

function normalizePath(path) {
  return String(path || '')
    .replaceAll('\\', '/')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
    .join('/');
}

function joinPath(base, name) {
  const left = normalizePath(base);
  const right = normalizePath(name);
  return [left, right].filter(Boolean).join('/');
}

function baseName(path) {
  const clean = normalizePath(path);
  if (!clean) return t('root');
  return clean.split('/').pop();
}

function getSearchQuery() {
  return $('globalSearch') ? $('globalSearch').value.trim() : '';
}

function itemIcon(item) {
  if (item.type === 'folder') return '▰';
  const category = item.category || 'file';
  const icons = {
    image: '◫',
    video: '▶',
    audio: '♪',
    pdf: 'PDF',
    archive: 'ZIP',
    document: 'DOC',
    spreadsheet: 'XLS',
    presentation: 'PPT',
    text: 'TXT',
    file: '□',
  };
  return icons[category] || icons.file;
}

function itemIconClass(item) {
  if (item.type === 'folder') return 'folder';
  return item.category || 'file';
}

function previewUrl(item) {
  return `/api/files/${item.id}/preview`;
}

function downloadUrl(item) {
  return `/api/files/${item.id}/download`;
}

function isPreviewable(item) {
  if (!item || item.type !== 'file') return false;
  const mime = item.mime_type || '';
  const ext = (item.extension || item.name?.split('.').pop() || '').toLowerCase();
  return mime.startsWith('image/')
    || mime.startsWith('audio/')
    || mime.startsWith('video/')
    || mime.includes('pdf')
    || mime.startsWith('text/')
    || ['txt', 'md', 'json', 'csv', 'log', 'xml'].includes(ext);
}

function createPreviewElement(item, compact = false) {
  const mime = item.mime_type || '';
  const ext = (item.extension || item.name?.split('.').pop() || '').toLowerCase();
  const url = previewUrl(item);

  if (mime.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = item.name;
    img.loading = 'lazy';
    return img;
  }
  if (mime.startsWith('video/')) {
    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    video.preload = compact ? 'metadata' : 'auto';
    video.playsInline = true;
    return video;
  }
  if (mime.startsWith('audio/')) {
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    audio.preload = compact ? 'metadata' : 'auto';
    return audio;
  }
  if (mime.includes('pdf') || ext === 'pdf' || mime.startsWith('text/') || ['txt', 'md', 'json', 'csv', 'log', 'xml'].includes(ext)) {
    const frame = document.createElement('iframe');
    frame.src = url;
    frame.title = item.name;
    return frame;
  }
  const fallback = document.createElement('div');
  fallback.className = 'preview-placeholder';
  fallback.textContent = t('noPreview');
  return fallback;
}

function openPreview(item) {
  if (!item || item.type !== 'file') return;
  $('previewTitle').textContent = item.name;
  $('previewMeta').textContent = `${item.mime_type || item.category || t('file')} · ${formatBytes(item.size)}`;
  $('previewOpenBtn').href = previewUrl(item);
  $('previewDownloadBtn').href = downloadUrl(item);
  const stage = $('previewStage');
  stage.innerHTML = '';
  stage.appendChild(createPreviewElement(item, false));
  openDialog('previewDialog');
}

function setButtonLoading(button, loading, textWhileLoading = t('pleaseWait')) {
  if (!button) return;
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.textContent = textWhileLoading;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
}

function openDialog(id) {
  const dialog = $(id);
  if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
}

function closeDialog(id) {
  if (id === 'previewDialog' && $('previewStage')) $('previewStage').innerHTML = `<div class="preview-placeholder">${t('previewLoading')}</div>`;
  const dialog = $(id);
  if (dialog && dialog.open) dialog.close();
}

function userDisplayName(me = {}) {
  return [me.first_name, me.last_name].filter(Boolean).join(' ') || me.username || me.phone || String(me.id || 'Telegram');
}

function setAuthView(status) {
  const configured = status.server_auth_configured;
  const serverAuthenticated = status.server_authenticated;
  const telegramAuthorized = status.telegram && status.telegram.authorized;

  show('authShell', !telegramAuthorized);
  show('setupWarning', !configured);
  show('serverLoginCard', configured && !serverAuthenticated);
  show('telegramLoginCard', configured && serverAuthenticated && !telegramAuthorized);
  show('driveApp', configured && serverAuthenticated && telegramAuthorized);

  if (telegramAuthorized) {
    const me = status.telegram.me || {};
    const name = userDisplayName(me);
    $('accountName').textContent = name;
    $('accountSubline').textContent = me.username ? `@${me.username}` : t('telegramConnected');
    $('accountAvatar').textContent = name.trim().charAt(0).toUpperCase() || 'T';
  }
}

async function refreshStatus() {
  const status = await api('/api/status');
  state.status = status;
  setAuthView(status);
  if (status.server_authenticated && status.telegram && status.telegram.authorized) {
    await Promise.all([loadStats(), loadExplorer(true)]);
  }
}

async function loadStats() {
  try {
    const stats = await api('/api/stats');
    state.stats = stats;
    $('statFiles').textContent = String(stats.total_files || 0);
    $('statSize').textContent = formatBytes(stats.total_size || 0);
    $('statFolders').textContent = String(stats.folders || 0);
  } catch (err) {
    console.warn(err);
  }
}

function updateNavigationState() {
  if (!$('navAll')) return;
  $('navAll').classList.toggle('active', state.scope === 'all');
  $('navRoot').classList.toggle('active', state.scope === 'folder' && state.currentFolder === '');
  qsa('.folder-node').forEach((node) => {
    node.classList.toggle('active', state.scope === 'folder' && node.dataset.path === state.currentFolder);
  });
}

function buildTree(paths) {
  const root = { children: new Map(), path: '' };
  for (const path of paths.map(normalizePath).filter(Boolean).sort((a, b) => a.localeCompare(b, state.lang === 'en' ? 'en' : 'de'))) {
    const parts = path.split('/');
    let node = root;
    let current = '';
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!node.children.has(part)) node.children.set(part, { name: part, path: current, children: new Map() });
      node = node.children.get(part);
    }
  }
  return root;
}

function renderFolderTree() {
  if (!$('folderTree')) return;
  const tree = buildTree(state.allFolders || []);
  const container = $('folderTree');
  container.innerHTML = '';
  if (!tree.children.size) {
    const empty = document.createElement('div');
    empty.className = 'muted folder-empty';
    empty.textContent = state.loading ? t('loading') : (state.lastSearch ? t('emptySearchTitle') : t('emptyTitle'));
    container.appendChild(empty);
    return;
  }

  function walk(node, depth = 0) {
    for (const child of node.children.values()) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'folder-node';
      btn.dataset.path = child.path;
      btn.style.paddingLeft = `${8 + depth * 18}px`;

      const icon = document.createElement('span');
      icon.textContent = child.children.size ? '▸' : '·';
      icon.style.color = 'var(--muted-2)';
      btn.appendChild(icon);

      const folderIcon = document.createElement('span');
      folderIcon.textContent = '▰';
      folderIcon.style.color = 'var(--warning)';
      btn.appendChild(folderIcon);

      const name = document.createElement('span');
      name.className = 'folder-name';
      name.textContent = child.name;
      btn.appendChild(name);

      btn.addEventListener('click', () => navigateToFolder(child.path));
      container.appendChild(btn);
      walk(child, depth + 1);
    }
  }

  walk(tree);
  updateNavigationState();
}

function renderBreadcrumbs() {
  if (!$('breadcrumbs')) return;
  const container = $('breadcrumbs');
  container.innerHTML = '';

  if (state.scope === 'all') {
    const all = document.createElement('button');
    all.type = 'button';
    all.className = 'crumb current';
    all.textContent = t('allFiles');
    container.appendChild(all);
    return;
  }

  const root = document.createElement('button');
  root.type = 'button';
  root.className = `crumb${state.currentFolder ? '' : ' current'}`;
  root.textContent = t('driveRoot');
  root.addEventListener('click', () => navigateToFolder(''));
  container.appendChild(root);

  const parts = state.currentFolder ? state.currentFolder.split('/') : [];
  let path = '';
  parts.forEach((part, index) => {
    const sep = document.createElement('span');
    sep.className = 'crumb-separator';
    sep.textContent = '/';
    container.appendChild(sep);

    path = path ? `${path}/${part}` : part;
    const crumb = document.createElement('button');
    crumb.type = 'button';
    crumb.className = `crumb${index === parts.length - 1 ? ' current' : ''}`;
    crumb.textContent = part;
    const target = path;
    crumb.addEventListener('click', () => navigateToFolder(target));
    container.appendChild(crumb);
  });
}

function setTitle() {
  if (!$('scopeLabel')) return;
  if (state.scope === 'all') {
    $('scopeLabel').textContent = t('wholeDrive');
    $('currentTitle').textContent = t('allFiles');
    if ($('globalSearch')) $('globalSearch').placeholder = t('searchAll');
    return;
  }
  $('scopeLabel').textContent = state.currentFolder ? t('currentFolder') : t('driveRoot');
  $('currentTitle').textContent = baseName(state.currentFolder);
  if ($('globalSearch')) $('globalSearch').placeholder = state.currentFolder ? t('searchInFolder', { folder: baseName(state.currentFolder) }) : t('searchRoot');
}

function navigateToFolder(folder) {
  state.scope = 'folder';
  state.currentFolder = normalizePath(folder);
  state.selected = null;
  closeMobileSidebar();
  loadExplorer(true);
}

function navigateAll() {
  state.scope = 'all';
  state.currentFolder = '';
  state.selected = null;
  closeMobileSidebar();
  loadExplorer(true);
}

function sortItems(items) {
  const value = $('sortSelect') ? $('sortSelect').value : 'date-desc';
  const locale = state.lang === 'en' ? 'en' : 'de';
  return [...items].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    if (value === 'name-asc') return String(a.name).localeCompare(String(b.name), locale, { sensitivity: 'base' });
    if (value === 'name-desc') return String(b.name).localeCompare(String(a.name), locale, { sensitivity: 'base' });
    if (value === 'size-asc') return Number(a.size || 0) - Number(b.size || 0);
    if (value === 'size-desc') return Number(b.size || 0) - Number(a.size || 0);
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    if (value === 'date-asc') return da - db;
    return db - da;
  });
}

function combinedItems() {
  const folders = (state.folders || []).map((folder) => ({ ...folder, type: 'folder', size: 0, date: null }));
  const files = (state.files || []).map((file) => ({ ...file, type: 'file' }));
  return sortItems([...folders, ...files]);
}

function sameItem(a, b) {
  if (!a || !b) return false;
  if (a.type !== b.type) return false;
  if (a.type === 'folder') return a.path === b.path;
  return a.id === b.id;
}

function selectItem(item) {
  state.selected = item;
  renderExplorer();
  renderDetails();
}

function makeItemIcon(item) {
  const icon = document.createElement('div');
  icon.className = `item-icon ${itemIconClass(item)}`;
  icon.textContent = itemIcon(item);
  return icon;
}

function actionButton(title, text, handler, danger = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = danger ? 'small-action danger' : 'small-action';
  button.title = title;
  button.textContent = text;
  button.addEventListener('click', handler);
  return button;
}

function linkButton(title, href, text) {
  const link = document.createElement('a');
  link.className = 'small-action';
  link.title = title;
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = text;
  return link;
}

function createRow(item) {
  const row = document.createElement('div');
  row.className = `explorer-row${sameItem(state.selected, item) ? ' selected' : ''}`;
  row.tabIndex = 0;

  const nameCell = document.createElement('div');
  nameCell.className = 'item-name';
  nameCell.appendChild(makeItemIcon(item));
  const title = document.createElement('div');
  title.className = 'item-title';
  const strong = document.createElement('strong');
  strong.textContent = item.name;
  const sub = document.createElement('span');
  sub.textContent = item.type === 'folder'
    ? t('totalFiles', { count: item.descendant_file_count || 0 })
    : item.mime_type || item.category || t('file');
  title.append(strong, sub);
  nameCell.appendChild(title);
  row.appendChild(nameCell);

  const folderCell = document.createElement('div');
  folderCell.className = 'row-muted';
  folderCell.textContent = item.type === 'folder' ? item.path : (item.folder || t('driveRoot'));
  row.appendChild(folderCell);

  const sizeCell = document.createElement('div');
  sizeCell.className = 'row-muted';
  sizeCell.textContent = item.type === 'folder' ? '–' : formatBytes(item.size);
  row.appendChild(sizeCell);

  const dateCell = document.createElement('div');
  dateCell.className = 'row-muted';
  dateCell.textContent = item.type === 'folder' ? t('virtual') : formatDate(item.date);
  row.appendChild(dateCell);

  const actions = document.createElement('div');
  actions.className = 'row-actions';
  if (item.type === 'folder') {
    actions.append(
      actionButton(t('open'), '↗', () => navigateToFolder(item.path)),
      actionButton(t('rename'), '✎', () => openRename(item)),
      actionButton(t('delete'), '×', () => deleteFolder(item), true)
    );
  } else {
    if (isPreviewable(item)) actions.append(actionButton(t('preview'), '▶', () => openPreview(item)));
    actions.append(
      linkButton(t('download'), downloadUrl(item), '↓'),
      actionButton(t('edit'), '✎', () => openRename(item)),
      actionButton(t('delete'), '×', () => deleteFile(item), true)
    );
  }
  row.appendChild(actions);

  const mobileMeta = document.createElement('div');
  mobileMeta.className = 'mobile-row-meta';
  mobileMeta.textContent = item.type === 'folder'
    ? `${item.path || t('driveRoot')} · ${t('totalFiles', { count: item.descendant_file_count || 0 })}`
    : `${item.folder || t('driveRoot')} · ${formatBytes(item.size)} · ${formatDate(item.date)}`;
  row.appendChild(mobileMeta);

  row.addEventListener('click', (event) => {
    if (event.target.closest('button, a')) return;
    selectItem(item);
  });
  row.addEventListener('dblclick', () => {
    if (item.type === 'folder') navigateToFolder(item.path);
    else if (isPreviewable(item)) openPreview(item);
    else window.open(downloadUrl(item), '_blank', 'noopener');
  });
  row.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      if (item.type === 'folder') navigateToFolder(item.path);
      else if (isPreviewable(item)) openPreview(item);
      else window.open(downloadUrl(item), '_blank', 'noopener');
    }
  });
  return row;
}

function createGridCard(item) {
  const card = document.createElement('div');
  card.className = `grid-card${sameItem(state.selected, item) ? ' selected' : ''}`;
  card.tabIndex = 0;

  const top = document.createElement('div');
  top.className = 'grid-card-top';
  top.appendChild(makeItemIcon(item));
  const actions = document.createElement('div');
  actions.className = 'grid-actions';
  if (item.type === 'folder') {
    actions.append(actionButton(t('open'), '↗', () => navigateToFolder(item.path)), actionButton(t('edit'), '✎', () => openRename(item)));
  } else {
    if (isPreviewable(item)) actions.append(actionButton(t('preview'), '▶', () => openPreview(item)));
    actions.append(linkButton(t('download'), downloadUrl(item), '↓'), actionButton(t('edit'), '✎', () => openRename(item)));
  }
  top.appendChild(actions);
  card.appendChild(top);

  const title = document.createElement('div');
  title.className = 'grid-title';
  const strong = document.createElement('strong');
  strong.textContent = item.name;
  const sub = document.createElement('span');
  sub.textContent = item.type === 'folder' ? item.path : (item.folder || t('driveRoot'));
  title.append(strong, sub);
  card.appendChild(title);

  const meta = document.createElement('div');
  meta.className = 'grid-meta';
  const left = document.createElement('span');
  left.textContent = item.type === 'folder' ? t('folderFiles', { count: item.descendant_file_count || 0 }) : formatBytes(item.size);
  const right = document.createElement('span');
  right.textContent = item.type === 'folder' ? t('folder') : (item.extension ? item.extension.toUpperCase() : t('file'));
  meta.append(left, right);
  card.appendChild(meta);

  card.addEventListener('click', (event) => {
    if (event.target.closest('button, a')) return;
    selectItem(item);
  });
  card.addEventListener('dblclick', () => {
    if (item.type === 'folder') navigateToFolder(item.path);
    else if (isPreviewable(item)) openPreview(item);
    else window.open(downloadUrl(item), '_blank', 'noopener');
  });
  return card;
}

function renderExplorer() {
  if (!$('explorerRows') || !$('gridView')) return;
  const items = combinedItems();
  $('explorerRows').innerHTML = '';
  $('gridView').innerHTML = '';

  for (const item of items) {
    $('explorerRows').appendChild(createRow(item));
    $('gridView').appendChild(createGridCard(item));
  }

  const fileCount = state.files.length;
  const folderCount = state.folders.length;
  const query = getSearchQuery();
  state.lastSearch = query;
  $('itemSummary').textContent = query
    ? t('searchSummary', { query, folders: folderCount, files: fileCount })
    : t('itemSummary', { folders: folderCount, files: fileCount });

  show('clearSearchBtn', Boolean(query));
  show('searchHint', Boolean(query));
  if ($('searchHint')) $('searchHint').textContent = state.scope === 'folder' ? t('searchHintFolder') : t('searchHintAll');
  if ($('emptyTitle')) $('emptyTitle').textContent = query ? t('emptySearchTitle') : t('emptyTitle');
  if ($('emptyText')) $('emptyText').textContent = query ? t('emptySearchText') : t('emptyText');

  show('emptyState', !state.loading && items.length === 0);
  show('listView', !state.loading && items.length > 0 && state.view === 'list');
  show('gridView', !state.loading && items.length > 0 && state.view === 'grid');
  show('loadMoreBtn', Boolean(state.hasMore));
  $('listViewBtn')?.classList.toggle('active', state.view === 'list');
  $('gridViewBtn')?.classList.toggle('active', state.view === 'grid');
  updateNavigationState();
}

function appendMetaLine(container, key, value) {
  const row = document.createElement('div');
  row.className = 'meta-line';
  const k = document.createElement('span');
  k.textContent = key;
  const v = document.createElement('span');
  v.textContent = value;
  row.append(k, v);
  container.appendChild(row);
}

function renderDetails() {
  if (!$('detailsPane')) return;
  const pane = $('detailsPane');
  pane.innerHTML = '';
  const item = state.selected;
  if (!item) {
    const empty = document.createElement('div');
    empty.className = 'details-empty';
    const icon = document.createElement('div');
    icon.className = 'details-icon';
    icon.textContent = '□';
    const title = document.createElement('h3');
    title.textContent = t('details');
    const text = document.createElement('p');
    text.textContent = t('detailsEmpty');
    empty.append(icon, title, text);
    pane.appendChild(empty);
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'details-card';
  const hero = document.createElement('div');
  hero.className = 'details-hero';
  hero.appendChild(makeItemIcon(item));

  const title = document.createElement('div');
  title.className = 'details-title';
  title.textContent = item.name;
  hero.appendChild(title);
  wrap.appendChild(hero);

  if (item.type === 'file' && isPreviewable(item)) {
    const preview = document.createElement('div');
    preview.className = 'details-media';
    preview.appendChild(createPreviewElement(item, true));
    wrap.appendChild(preview);
  }

  const meta = document.createElement('div');
  meta.className = 'details-meta';
  const rows = item.type === 'folder'
    ? [
        [t('type'), t('folderType')],
        [t('path'), item.path || t('driveRoot')],
        [t('files'), t('totalFiles', { count: item.descendant_file_count || 0 })],
        [t('directly'), t('directFiles', { count: item.direct_file_count || 0 })],
      ]
    : [
        [t('type'), item.mime_type || item.category || t('file')],
        [t('name'), item.name],
        [t('folder'), item.folder || t('driveRoot')],
        [t('size'), formatBytes(item.size)],
        [t('date'), formatDate(item.date)],
        ['Telegram ID', String(item.id)],
      ];
  rows.forEach(([key, value]) => appendMetaLine(meta, key, value));
  wrap.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'details-actions';
  if (item.type === 'folder') {
    const open = document.createElement('button');
    open.className = 'primary full';
    open.type = 'button';
    open.textContent = t('openFolder');
    open.addEventListener('click', () => navigateToFolder(item.path));
    const rename = document.createElement('button');
    rename.className = 'secondary full';
    rename.type = 'button';
    rename.textContent = t('renameFolder');
    rename.addEventListener('click', () => openRename(item));
    actions.append(open, rename);
  } else {
    const preview = document.createElement('button');
    preview.className = 'secondary full';
    preview.type = 'button';
    preview.textContent = t('viewPlay');
    preview.disabled = !isPreviewable(item);
    preview.addEventListener('click', () => openPreview(item));
    const download = document.createElement('a');
    download.className = 'primary full';
    download.href = downloadUrl(item);
    download.target = '_blank';
    download.rel = 'noopener';
    download.textContent = t('download');
    const rename = document.createElement('button');
    rename.className = 'secondary full';
    rename.type = 'button';
    rename.textContent = t('moveRename');
    rename.addEventListener('click', () => openRename(item));
    const del = document.createElement('button');
    del.className = 'danger full';
    del.type = 'button';
    del.textContent = t('delete');
    del.addEventListener('click', () => deleteFile(item));
    actions.append(preview, download, rename, del);
  }
  wrap.appendChild(actions);
  pane.appendChild(wrap);
}

async function loadExplorer(reset = true) {
  if (state.loading) {
    state.pendingReload = true;
    state.pendingReset = state.pendingReset || reset;
    return;
  }
  state.loading = true;
  const requestId = ++state.requestSeq;
  show('loadingState', true);
  show('emptyState', false);
  if (reset) {
    state.files = [];
    state.folders = [];
    state.nextOffsetId = 0;
    state.hasMore = false;
  }
  renderBreadcrumbs();
  setTitle();
  updateNavigationState();

  try {
    const query = getSearchQuery();
    const params = new URLSearchParams({
      scope: state.scope,
      folder: state.currentFolder,
      search: query,
      limit: '140',
      offset_id: String(reset ? 0 : state.nextOffsetId || 0),
      scan_limit: query ? '16000' : '5000',
    });
    const data = await api(`/api/explorer?${params.toString()}`);
    if (requestId !== state.requestSeq) return;
    state.folders = data.folders || [];
    state.allFolders = data.all_folders || [];
    state.files = reset ? (data.files || []) : [...state.files, ...(data.files || [])];
    state.nextOffsetId = data.next_offset_id || 0;
    state.hasMore = Boolean(data.has_more);
    state.lastSearch = data.search || query;
    renderFolderTree();
  } catch (err) {
    toast(err.message, true);
  } finally {
    if (requestId === state.requestSeq) {
      state.loading = false;
      show('loadingState', false);
      renderBreadcrumbs();
      setTitle();
      renderExplorer();
      renderDetails();
    }
    if (state.pendingReload) {
      const pendingReset = state.pendingReset;
      state.pendingReload = false;
      state.pendingReset = false;
      setTimeout(() => loadExplorer(pendingReset), 0);
    }
  }
}

function openUploadDialog(files = null) {
  $('uploadFolder').value = state.scope === 'folder' ? state.currentFolder : '';
  if (files && files.length) {
    const dt = new DataTransfer();
    Array.from(files).forEach((file) => dt.items.add(file));
    $('uploadFile').files = dt.files;
  }
  resetUploadProgress();
  openDialog('uploadDialog');
}

function resetUploadProgress() {
  show('uploadProgressWrap', false);
  $('uploadProgressBar').style.width = '0%';
  $('uploadProgressPct').textContent = '0%';
  $('uploadProgressText').textContent = t('uploading');
}

function uploadSingleFile(file, folder, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    xhr.withCredentials = true;
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    });
    xhr.addEventListener('load', () => {
      let data = null;
      try { data = JSON.parse(xhr.responseText || '{}'); } catch { data = {}; }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error || `${t('uploadFailed')} (${xhr.status})`));
    });
    xhr.addEventListener('error', () => reject(new Error(t('uploadFailed'))));
    xhr.send(form);
  });
}

async function uploadFiles(fileList, folder) {
  const files = Array.from(fileList || []);
  if (!files.length) throw new Error(t('noFileSelected'));
  folder = normalizePath(folder);
  show('uploadProgressWrap', true);
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    $('uploadProgressText').textContent = `${index + 1}/${files.length}: ${file.name}`;
    await uploadSingleFile(file, folder, (fraction) => {
      const overall = ((index + fraction) / files.length) * 100;
      $('uploadProgressBar').style.width = `${Math.round(overall)}%`;
      $('uploadProgressPct').textContent = `${Math.round(overall)}%`;
    });
  }
  $('uploadProgressBar').style.width = '100%';
  $('uploadProgressPct').textContent = '100%';
}

function openNewFolderDialog() {
  $('newFolderName').value = state.scope === 'folder' && state.currentFolder ? `${state.currentFolder}/` : '';
  openDialog('newFolderDialog');
  setTimeout(() => $('newFolderName').focus(), 40);
}

function openRename(item) {
  state.renameTarget = item;
  $('renameTypeLabel').textContent = item.type === 'folder' ? t('editFolder') : t('editFile');
  $('renameDialogTitle').textContent = item.type === 'folder' ? t('renameFolder') : t('renameFile');
  $('renameNameLabel').classList.toggle('hidden', item.type === 'folder');
  $('renameName').value = item.type === 'folder' ? '' : item.name;
  $('renameFolder').value = item.type === 'folder' ? item.path : (item.folder || '');
  openDialog('renameDialog');
}

async function deleteFile(item) {
  if (!confirm(t('confirmDeleteFile', { name: item.name }))) return;
  try {
    await api(`/api/files/${item.id}`, { method: 'DELETE' });
    toast(t('fileDeleted'));
    if (state.selected && state.selected.id === item.id) state.selected = null;
    await Promise.all([loadStats(), loadExplorer(true)]);
  } catch (err) {
    toast(err.message, true);
  }
}

async function deleteFolder(item) {
  if (!confirm(t('confirmDeleteFolder', { path: item.path }))) return;
  try {
    await api(`/api/folders?folder=${encodeURIComponent(item.path)}`, { method: 'DELETE' });
    toast(t('folderRemoved'));
    if (state.currentFolder === item.path || state.currentFolder.startsWith(`${item.path}/`)) state.currentFolder = '';
    state.selected = null;
    await Promise.all([loadStats(), loadExplorer(true)]);
  } catch (err) {
    toast(err.message, true);
  }
}

function closeMobileSidebar() {
  $('sidebar')?.classList.remove('open');
  $('sidebarOverlay')?.classList.remove('open');
}

function toggleMobileSidebar() {
  $('sidebar')?.classList.toggle('open');
  $('sidebarOverlay')?.classList.toggle('open');
}

function bindEvents() {
  qsa('[data-language-select]').forEach((select) => {
    select.addEventListener('change', () => {
      state.lang = select.value === 'en' ? 'en' : 'de';
      localStorage.setItem('tdweb:lang', state.lang);
      applyI18n();
    });
  });

  $('serverLoginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter;
    setButtonLoading(button, true);
    try {
      await api('/api/server/login', { method: 'POST', body: JSON.stringify({ password: $('serverPassword').value }) });
      $('serverPassword').value = '';
      toast(t('unlocked'));
      await refreshStatus();
    } catch (err) {
      toast(err.message, true);
    } finally {
      setButtonLoading(button, false);
    }
  });

  $('serverLogoutBtn').addEventListener('click', async () => {
    try {
      await api('/api/server/logout', { method: 'POST', body: JSON.stringify({}) });
      await refreshStatus();
    } catch (err) {
      toast(err.message, true);
    }
  });

  $('telegramStartForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter;
    setButtonLoading(button, true, t('requestingCode'));
    try {
      await api('/api/telegram/start', {
        method: 'POST',
        body: JSON.stringify({
          api_id: Number($('apiId').value),
          api_hash: $('apiHash').value.trim(),
          phone: $('phone').value.trim(),
        }),
      });
      show('telegramCodeForm', true);
      toast(t('codeRequested'));
    } catch (err) {
      toast(err.message, true);
    } finally {
      setButtonLoading(button, false);
    }
  });

  $('telegramCodeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter;
    setButtonLoading(button, true, t('checkingCode'));
    try {
      const data = await api('/api/telegram/verify', { method: 'POST', body: JSON.stringify({ code: $('telegramCode').value.trim() }) });
      if (data.next_step === 'password') {
        show('telegramPasswordForm', true);
        toast(t('twoFaRequired'));
      } else {
        toast(t('telegramConnected'));
        await refreshStatus();
      }
    } catch (err) {
      toast(err.message, true);
    } finally {
      setButtonLoading(button, false);
    }
  });

  $('telegramPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter;
    setButtonLoading(button, true, t('checkingTwoFa'));
    try {
      await api('/api/telegram/password', { method: 'POST', body: JSON.stringify({ password: $('telegramPassword').value }) });
      $('telegramPassword').value = '';
      toast(t('telegramConnected'));
      await refreshStatus();
    } catch (err) {
      toast(err.message, true);
    } finally {
      setButtonLoading(button, false);
    }
  });

  $('telegramLogoutBtn').addEventListener('click', async () => {
    if (!confirm(t('confirmTelegramLogout'))) return;
    try {
      await api('/api/telegram/logout', { method: 'POST', body: JSON.stringify({}) });
      await refreshStatus();
    } catch (err) {
      toast(err.message, true);
    }
  });

  $('navAll').addEventListener('click', navigateAll);
  $('navRoot').addEventListener('click', () => navigateToFolder(''));
  $('refreshBtn').addEventListener('click', async () => {
    await Promise.all([loadStats(), loadExplorer(true)]);
    toast(t('updated'));
  });

  $('uploadOpenBtn').addEventListener('click', () => openUploadDialog());
  $('dropUploadBtn').addEventListener('click', () => openUploadDialog());
  $('emptyUploadBtn').addEventListener('click', () => openUploadDialog());
  $('sidebarNewFolderBtn').addEventListener('click', openNewFolderDialog);
  $('newFolderBtn').addEventListener('click', openNewFolderDialog);
  $('sidebarToggleBtn').addEventListener('click', toggleMobileSidebar);
  $('sidebarOverlay').addEventListener('click', closeMobileSidebar);

  $('sortSelect').addEventListener('change', renderExplorer);
  $('listViewBtn').addEventListener('click', () => {
    state.view = 'list';
    localStorage.setItem('tdweb:view', state.view);
    renderExplorer();
  });
  $('gridViewBtn').addEventListener('click', () => {
    state.view = 'grid';
    localStorage.setItem('tdweb:view', state.view);
    renderExplorer();
  });

  let searchTimer = null;
  $('globalSearch').addEventListener('input', () => {
    show('clearSearchBtn', Boolean(getSearchQuery()));
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => loadExplorer(true), 220);
  });
  $('globalSearch').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      clearTimeout(searchTimer);
      loadExplorer(true);
    }
  });
  $('clearSearchBtn').addEventListener('click', () => {
    $('globalSearch').value = '';
    loadExplorer(true);
    $('globalSearch').focus();
  });

  $('loadMoreBtn').addEventListener('click', () => loadExplorer(false));

  $('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.submitter;
    setButtonLoading(button, true, t('uploading'));
    try {
      await uploadFiles($('uploadFile').files, $('uploadFolder').value);
      closeDialog('uploadDialog');
      $('uploadFile').value = '';
      toast(t('uploadDone'));
      await Promise.all([loadStats(), loadExplorer(true)]);
    } catch (err) {
      toast(err.message, true);
    } finally {
      setButtonLoading(button, false);
    }
  });

  $('newFolderForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const folder = normalizePath($('newFolderName').value);
    const finalFolder = folder.includes('/') || state.scope !== 'folder' ? folder : joinPath(state.currentFolder, folder);
    const button = event.submitter;
    setButtonLoading(button, true, t('creating'));
    try {
      const data = await api('/api/folders', { method: 'POST', body: JSON.stringify({ folder: finalFolder }) });
      closeDialog('newFolderDialog');
      toast(t('folderCreated'));
      navigateToFolder(data.folder);
      await loadStats();
    } catch (err) {
      toast(err.message, true);
    } finally {
      setButtonLoading(button, false);
    }
  });

  $('renameForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const target = state.renameTarget;
    if (!target) return;
    const button = event.submitter;
    setButtonLoading(button, true, t('saving'));
    try {
      if (target.type === 'folder') {
        const newFolder = normalizePath($('renameFolder').value);
        await api('/api/folders/rename', {
          method: 'PATCH',
          body: JSON.stringify({ old_folder: target.path, new_folder: newFolder }),
        });
        state.currentFolder = state.currentFolder === target.path ? newFolder : state.currentFolder;
      } else {
        await api(`/api/files/${target.id}/meta`, {
          method: 'PATCH',
          body: JSON.stringify({ name: $('renameName').value.trim(), folder: normalizePath($('renameFolder').value) }),
        });
      }
      closeDialog('renameDialog');
      state.selected = null;
      toast(t('saved'));
      await Promise.all([loadStats(), loadExplorer(true)]);
    } catch (err) {
      toast(err.message, true);
    } finally {
      setButtonLoading(button, false);
    }
  });

  qsa('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(button.dataset.closeModal));
  });

  const dropzone = $('dropzone');
  ['dragenter', 'dragover'].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', (event) => {
    const files = event.dataTransfer.files;
    if (files && files.length) openUploadDialog(files);
  });

  $('hiddenFilePicker').addEventListener('change', () => {
    if ($('hiddenFilePicker').files.length) openUploadDialog($('hiddenFilePicker').files);
  });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'u') {
      event.preventDefault();
      openUploadDialog();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      loadExplorer(true);
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
      event.preventDefault();
      $('globalSearch')?.focus();
    }
    if (event.key === 'Escape') closeMobileSidebar();
  });
}

applyI18n();
bindEvents();
refreshStatus().catch((err) => toast(err.message, true));

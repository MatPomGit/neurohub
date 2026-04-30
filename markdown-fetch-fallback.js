/*
 * markdown-fetch-fallback.js
 *
 * Stabilizuje ładowanie artykułów Markdown w SPA. Najpierw zachowuje standardowe
 * pobieranie względne z hostingu statycznego, a gdy ono zwróci błąd dla pliku .md,
 * próbuje pobrać ten sam plik z raw.githubusercontent.com dla bieżącego repozytorium.
 */
(function setupMarkdownFetchFallback() {
  if (window.__psyhubMarkdownFetchFallbackInstalled) return;
  window.__psyhubMarkdownFetchFallbackInstalled = true;

  const originalFetch = window.fetch.bind(window);
  const RAW_BASE_URL = 'https://raw.githubusercontent.com/MatPomGit/PsyHub/main/';

  function isMarkdownRequest(resource) {
    const url = typeof resource === 'string'
      ? resource
      : resource instanceof Request
        ? resource.url
        : String(resource || '');

    return /\.md(?:[?#].*)?$/i.test(url);
  }

  function extractRepositoryPath(resource) {
    const rawUrl = typeof resource === 'string'
      ? resource
      : resource instanceof Request
        ? resource.url
        : String(resource || '');

    const withoutHash = rawUrl.split('#')[0];
    const withoutQuery = withoutHash.split('?')[0];

    try {
      const parsed = new URL(withoutQuery, window.location.href);
      const path = parsed.pathname
        .replace(/^\/+/, '')
        .replace(/^PsyHub\//i, '')
        .replace(/^blob\/main\//i, '')
        .replace(/^raw\/main\//i, '');
      const wikiIndex = path.indexOf('wiki/');
      if (wikiIndex >= 0) return path.slice(wikiIndex);
      return path;
    } catch (_) {
      return withoutQuery
        .replace(/^\.\//, '')
        .replace(/^\/+/, '')
        .replace(/^PsyHub\//i, '')
        .replace(/^blob\/main\//i, '')
        .replace(/^raw\/main\//i, '');
    }
  }

  function buildRawGithubUrl(resource) {
    const repositoryPath = extractRepositoryPath(resource);
    if (!repositoryPath || !/\.md$/i.test(repositoryPath)) return null;
    return RAW_BASE_URL + repositoryPath.split('/').map(encodeURIComponent).join('/');
  }

  window.fetch = async function fetchWithMarkdownFallback(resource, init) {
    if (!isMarkdownRequest(resource)) {
      return originalFetch(resource, init);
    }

    let firstResponse;
    let firstError = null;

    try {
      firstResponse = await originalFetch(resource, init);
      if (firstResponse.ok) return firstResponse;
    } catch (error) {
      firstError = error;
    }

    const rawUrl = buildRawGithubUrl(resource);
    if (!rawUrl) {
      if (firstResponse) return firstResponse;
      throw firstError || new Error('Nie udało się pobrać artykułu Markdown.');
    }

    try {
      const fallbackResponse = await originalFetch(rawUrl, init);
      if (fallbackResponse.ok) return fallbackResponse;
      return firstResponse || fallbackResponse;
    } catch (fallbackError) {
      if (firstResponse) return firstResponse;
      throw firstError || fallbackError;
    }
  };
})();

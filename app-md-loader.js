/*
 * app-md-loader.js
 *
 * Nadpisuje wyłącznie loader artykułów Markdown, bez monkey-patchowania
 * globalnego window.fetch. Dzięki temu fallback raw.githubusercontent.com dotyczy
 * tylko artykułów .md używanych przez PsyHub.
 */
(function setupArticleMarkdownLoader() {
  const RAW_BASE_URL = 'https://raw.githubusercontent.com/MatPomGit/PsyHub/main/';

  function normalizeArticlePath(rawPath) {
    return String(rawPath || '')
      .trim()
      .replace(/\\/g, '/')
      .replace(/^\.\//, '')
      .replace(/^\/+/, '')
      .replace(/^PsyHub\//i, '')
      .replace(/^blob\/main\//i, '')
      .replace(/^raw\/main\//i, '')
      .replace(/\/{2,}/g, '/');
  }

  function buildLocalCandidates(filePath) {
    const normalized = normalizeArticlePath(filePath);
    return [
      normalized,
      normalized ? `./${normalized}` : '',
      normalized ? encodeURI(normalized) : '',
      normalized ? `./${encodeURI(normalized)}` : '',
    ].filter(Boolean);
  }

  function buildRawCandidate(filePath) {
    const normalized = normalizeArticlePath(filePath);
    if (!normalized || !/\.md$/i.test(normalized)) return null;
    return RAW_BASE_URL + normalized.split('/').map(encodeURIComponent).join('/');
  }

  async function fetchTextCandidate(candidate) {
    const response = await fetch(candidate, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${candidate}`);
    }
    return { text: await response.text(), resolvedPath: candidate };
  }

  window.fetchArticleMarkdown = async function fetchArticleMarkdownWithRawFallback(filePath) {
    const normalized = normalizeArticlePath(filePath);
    const candidates = [...new Set([...buildLocalCandidates(normalized), buildRawCandidate(normalized)].filter(Boolean))];
    let lastError = null;

    for (const candidate of candidates) {
      try {
        return await fetchTextCandidate(candidate);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error(`Nie udało się pobrać pliku: ${normalized}`);
  };

  window.prefetch = function prefetchWithMarkdownLoader(id) {
    if (typeof prevNext !== 'function' || typeof parseArticleFrontmatter !== 'function' || typeof isBodyEmpty !== 'function') return;
    const { prev, next } = prevNext(id);
    for (const it of [prev, next]) {
      if (!it?.file || mdCache.has(it.file)) continue;
      window.fetchArticleMarkdown(it.file)
        .then(result => {
          mdCache.set(it.file, result.text);
          const parsed = parseArticleFrontmatter(result.text);
          if (isBodyEmpty(parsed.body)) {
            emptyArticles.add(it.id);
            updateEmptyIndicators();
          }
        })
        .catch(() => {
          emptyArticles.add(it.id);
          updateEmptyIndicators();
        });
    }
  };

  function reloadCurrentEmptyArticleOnce() {
    const alreadyRetriedKey = 'psyhub-md-loader-retried';
    if (sessionStorage.getItem(alreadyRetriedKey) === window.location.hash) return;
    const renderedEmptyBanner = document.querySelector('.empty-banner');
    if (!renderedEmptyBanner || typeof parseRouteHash !== 'function' || typeof navigate !== 'function') return;

    const { pageId } = parseRouteHash(window.location.hash);
    const item = pageMap?.get(pageId);
    if (!item?.file) return;

    sessionStorage.setItem(alreadyRetriedKey, window.location.hash);
    navigate(pageId, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reloadCurrentEmptyArticleOnce, { once: true });
  } else {
    reloadCurrentEmptyArticleOnce();
  }
})();

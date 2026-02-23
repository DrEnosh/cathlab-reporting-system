// ============================================================
// Router – Hash-based client-side routing
// ============================================================

const routes = {};
let currentRoute = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return currentRoute;
}

function matchRoute(hash) {
  const path = hash.replace('#', '') || '/new';

  // Exact match first
  if (routes[path]) return { handler: routes[path], params: {} };

  // Parameterized match (e.g., /report/:id)
  for (const pattern of Object.keys(routes)) {
    const paramNames = [];
    const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const match = path.match(new RegExp(`^${regexStr}$`));
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => params[name] = match[i + 1]);
      return { handler: routes[pattern], params };
    }
  }

  return null;
}

export function initRouter() {
  const handleRoute = () => {
    const hash = window.location.hash || '#/new';
    const result = matchRoute(hash);

    if (result) {
      currentRoute = hash.replace('#', '');
      result.handler(result.params);
      updateNavLinks(currentRoute);
    } else {
      navigate('/new');
    }
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function updateNavLinks(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPath = href.replace('#', '');
    link.classList.toggle('active', path.startsWith(linkPath));
  });
}

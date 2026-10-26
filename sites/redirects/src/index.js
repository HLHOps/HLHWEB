// Forwards alternate / misspelled domains to the two real sites with a 301,
// keeping the path and query string (so /gallery/?utm=x still works).
// To add a domain: add it here AND to "routes" in ../wrangler.jsonc, then deploy.
const TARGETS = {
  'belindaholliday.com': 'https://belindavidorholliday.com',
  'belindavidor.com': 'https://belindavidorholliday.com',
  'holidaylakehouse.com': 'https://hollidaylakehouse.com',
  'hollidaylake.com': 'https://hollidaylakehouse.com',
  'holidaylake.net': 'https://hollidaylakehouse.com',
  'hollidaylake.net': 'https://hollidaylakehouse.com',
};

export default {
  fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname.replace(/^www\./, '');
    const target = TARGETS[host];
    if (!target) return new Response('Not found', { status: 404 });
    return Response.redirect(target + url.pathname + url.search, 301);
  },
};

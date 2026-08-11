/**
 * Cloudflare Worker entry point for the Holliday Lake House site.
 *
 * Responsibilities:
 *  1. Redirect any plain-HTTP request to its HTTPS equivalent with a
 *     permanent (301) redirect, preserving host, path, and query string.
 *  2. Otherwise, hand the request to the static-assets binding, which serves
 *     the Astro build output in ./dist exactly as it would without a Worker.
 *
 * This Worker runs ahead of static assets (see `run_worker_first` in
 * wrangler.jsonc) so the redirect applies to every path, including "/".
 */

interface Env {
  // Static-assets binding declared in wrangler.jsonc. Fetches from ./dist.
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

/**
 * Determine whether the original client request arrived over plain HTTP.
 *
 * Behind Cloudflare, `request.url` is not always a reliable indicator of the
 * client-facing scheme, so we prefer the `CF-Visitor` header, which Cloudflare
 * sets to `{"scheme":"http"}` or `{"scheme":"https"}`. We fall back to the URL
 * protocol when that header is absent (e.g. local `wrangler dev`).
 */
function isInsecureRequest(request: Request, url: URL): boolean {
  const cfVisitor = request.headers.get('CF-Visitor');
  if (cfVisitor) {
    try {
      const { scheme } = JSON.parse(cfVisitor) as { scheme?: string };
      if (scheme) return scheme === 'http';
    } catch {
      // Malformed header — fall through to the URL-based check below.
    }
  }
  return url.protocol === 'http:';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (isInsecureRequest(request, url)) {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};

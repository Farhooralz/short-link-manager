const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Link not found</title>
<style>
  :root { color-scheme: light dark; --bg: #ffffff; --fg: #0a0a0a; --muted: #737373; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #0a0a0a; --fg: #fafafa; --muted: #a3a3a3; }
  }
  body {
    margin: 0; min-height: 100vh; padding: 1rem; box-sizing: border-box;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 1rem; text-align: center; background: var(--bg); color: var(--fg);
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  .code { margin: 0; font-family: ui-monospace, monospace; font-size: 0.875rem; color: var(--muted); }
  h1 { margin: 0; font-size: 1.875rem; letter-spacing: -0.025em; }
  p { margin: 0; max-width: 28rem; color: var(--muted); }
  a {
    padding: 0.5rem 1rem; border-radius: 0.5rem; text-decoration: none;
    background: var(--fg); color: var(--bg); font-size: 0.875rem; font-weight: 500;
  }
</style>
</head>
<body>
  <p class="code">404</p>
  <h1>Page not found</h1>
  <p>This link doesn’t exist, or it may have been deleted.</p>
  <a href="/">Go home</a>
</body>
</html>`;

export function linkNotFoundResponse(): Response {
  return new Response(html, {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
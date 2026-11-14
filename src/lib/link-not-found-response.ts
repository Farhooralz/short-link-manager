type Copy = {
  lang: string;
  dir: "ltr" | "rtl";
  code: string;
  title: string;
  description: string;
  home: string;
};

const COPY: Record<"en" | "fa", Copy> = {
  en: {
    lang: "en",
    dir: "ltr",
    code: "404",
    title: "Page not found",
    description: "This link doesn’t exist, or it may have been deleted.",
    home: "Go home",
  },
  fa: {
    lang: "fa",
    dir: "rtl",
    code: "۴۰۴",
    title: "صفحه پیدا نشد",
    description: "این لینک وجود ندارد یا ممکن است حذف شده باشد.",
    home: "بازگشت به صفحه اصلی",
  },
};

function pickCopy(acceptLanguage: string | null): Copy {
  const first = acceptLanguage?.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("fa") ? COPY.fa : COPY.en;
}

function renderHtml(copy: Copy): string {
  return `<!doctype html>
<html lang="${copy.lang}" dir="${copy.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${copy.title}</title>
<style>
  :root { color-scheme: light dark; --bg: #ffffff; --fg: #0a0a0a; --muted: #737373; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #0a0a0a; --fg: #fafafa; --muted: #a3a3a3; }
  }
  body {
    margin: 0; min-height: 100vh; padding: 1rem; box-sizing: border-box;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 1rem; text-align: center; background: var(--bg); color: var(--fg);
    font-family: system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif;
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
  <p class="code">${copy.code}</p>
  <h1>${copy.title}</h1>
  <p>${copy.description}</p>
  <a href="/">${copy.home}</a>
</body>
</html>`;
}

export function linkNotFoundResponse(acceptLanguage: string | null): Response {
  return new Response(renderHtml(pickCopy(acceptLanguage)), {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
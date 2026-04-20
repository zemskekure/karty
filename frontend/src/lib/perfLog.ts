// One-shot page-load performance log. Prints to the console when the
// window 'load' event fires, summarising the key navigation timings plus a
// breakdown of every network resource (JS, CSS, images, frames, fonts, …)
// so you can see exactly what's dragging the initial paint.

const fmtBytes = (n: number) =>
  n >= 1024 * 1024 ? (n / 1048576).toFixed(2) + " MB"
    : n >= 1024 ? (n / 1024).toFixed(1) + " KB"
    : n + " B";

type Bucket = { count: number; bytes: number; duration: number };

function classify(url: string): string {
  if (/\/frames\//.test(url)) return "frames (sequence)";
  if (/\.(webp|png|jpe?g|avif|gif|svg)(\?|$)/i.test(url)) return "images";
  if (/\.(woff2?|ttf|otf|eot)(\?|$)/i.test(url)) return "fonts";
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return "video";
  if (/\.css(\?|$)/i.test(url)) return "css";
  if (/\.js(\?|$)/i.test(url) || url.includes("/assets/index-")) return "js";
  if (url.endsWith("/") || /\.html(\?|$)/i.test(url)) return "document";
  return "other";
}

function runReport() {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];

  const buckets = new Map<string, Bucket>();
  let totalBytes = 0;
  for (const r of resources) {
    const kind = classify(r.name);
    const bytes = r.transferSize || r.encodedBodySize || 0;
    totalBytes += bytes;
    const b = buckets.get(kind) || { count: 0, bytes: 0, duration: 0 };
    b.count += 1;
    b.bytes += bytes;
    b.duration += r.duration;
    buckets.set(kind, b);
  }

  console.group(
    `%c[perf] page loaded in ${nav ? nav.loadEventEnd.toFixed(0) : "?"}ms`,
    "color:#e63329;font-weight:bold"
  );
  if (nav) {
    console.log(
      `  DOMContentLoaded: ${nav.domContentLoadedEventEnd.toFixed(0)}ms` +
      `\n  load event:       ${nav.loadEventEnd.toFixed(0)}ms` +
      `\n  TTFB:             ${nav.responseStart.toFixed(0)}ms` +
      `\n  transfer size:    ${fmtBytes(nav.transferSize || 0)} (doc)`
    );
  }
  console.log(`  resources:        ${resources.length} (${fmtBytes(totalBytes)} total)`);

  const rows: Record<string, any>[] = [];
  for (const [kind, b] of Array.from(buckets.entries()).sort((a, b) => b[1].bytes - a[1].bytes)) {
    rows.push({
      type: kind,
      count: b.count,
      bytes: fmtBytes(b.bytes),
      avgMs: (b.duration / b.count).toFixed(0),
    });
  }
  console.table(rows);
  console.groupEnd();
}

if (document.readyState === "complete") {
  // Give a tick for PerformanceResourceTiming to finalise.
  setTimeout(runReport, 0);
} else {
  window.addEventListener("load", () => setTimeout(runReport, 0), { once: true });
}

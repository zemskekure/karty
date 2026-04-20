import { useEffect, useRef } from "react";

const FRAME_COUNT = 144;
const EAGER_COUNT = Math.ceil(FRAME_COUNT * 0.15);
const PREFETCH_AHEAD = 12;
const PREFETCH_BEHIND = 4;
// Use Vite's base so the paths resolve both at "/" in dev and "/karty/" on Pages.
const BASE = import.meta.env.BASE_URL;
const framePath = (i: number) =>
  `${BASE}frames/Pack360_1_${String(i).padStart(5, "0")}.webp`;

type Props = {
  // 0 → 1 — position along the rotation sequence
  progress: number;
  className?: string;
  style?: React.CSSProperties;
};

export function PackSequence({ progress, className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<ImageBitmap | null>>(new Array(FRAME_COUNT).fill(null));
  const inflightRef = useRef<boolean[]>(new Array(FRAME_COUNT).fill(false));
  const currentFrameRef = useRef(0);
  const eagerDoneRef = useRef(false);

  // One-time setup: eager-load first 15%, then let scroll drive the rest.
  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- perf log state ---
    const t0 = performance.now();
    const sizes = new Array<number>(FRAME_COUNT).fill(0);
    let loadedCount = 0;
    let bytesTotal = 0;
    let eagerLoggedAt = 0;
    let firstPaintAt = 0;
    let summaryLogged = false;

    const fmtBytes = (n: number) =>
      n >= 1024 * 1024 ? (n / 1048576).toFixed(2) + " MB"
        : n >= 1024 ? (n / 1024).toFixed(1) + " KB"
        : n + " B";

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };
    sizeCanvas();

    const nearestLoaded = (idx: number) => {
      const images = imagesRef.current;
      if (images[idx]) return idx;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (idx - d >= 0 && images[idx - d]) return idx - d;
        if (idx + d < FRAME_COUNT && images[idx + d]) return idx + d;
      }
      return -1;
    };

    const draw = (idx: number) => {
      const pick = nearestLoaded(idx);
      if (pick < 0) return;
      const img = imagesRef.current[pick]!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cw = canvas.width, ch = canvas.height;
      const ratio = Math.min(cw / img.width, ch / img.height);
      const w = img.width * ratio, h = img.height * ratio;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      currentFrameRef.current = idx;
      if (!firstPaintAt) {
        firstPaintAt = performance.now();
        console.log(
          `%c[PackSequence] first paint`,
          "color:#e63329;font-weight:bold",
          `frame ${pick}, ${(firstPaintAt - t0).toFixed(0)}ms after init`
        );
      }
    };

    const loadFrame = async (i: number) => {
      if (cancelled) return;
      if (imagesRef.current[i] || inflightRef.current[i]) return;
      inflightRef.current[i] = true;
      const tStart = performance.now();
      try {
        const res = await fetch(framePath(i));
        const blob = await res.blob();
        const bmp = await createImageBitmap(blob);
        if (cancelled) { bmp.close?.(); return; }
        imagesRef.current[i] = bmp;
        loadedCount += 1;
        sizes[i] = blob.size;
        bytesTotal += blob.size;
        const ms = (performance.now() - tStart).toFixed(0);
        console.log(
          `[PackSequence] ${String(i).padStart(3, "0")}/${FRAME_COUNT - 1}  ` +
          `${fmtBytes(blob.size).padStart(9)}  ${ms.padStart(4)}ms  ` +
          `(${loadedCount}/${FRAME_COUNT}, total ${fmtBytes(bytesTotal)})`
        );
        if (Math.abs(i - currentFrameRef.current) <= 1) draw(currentFrameRef.current);
        if (loadedCount === FRAME_COUNT && !summaryLogged) {
          summaryLogged = true;
          const dt = (performance.now() - t0) / 1000;
          console.log(
            `%c[PackSequence] sequence fully loaded`,
            "color:#e63329;font-weight:bold",
            `\n  frames:     ${FRAME_COUNT}` +
            `\n  bandwidth:  ${fmtBytes(bytesTotal)}` +
            `\n  avg/frame:  ${fmtBytes(bytesTotal / FRAME_COUNT)}` +
            `\n  elapsed:    ${dt.toFixed(2)}s` +
            `\n  throughput: ${fmtBytes(bytesTotal / dt)}/s`
          );
        }
      } catch (err) {
        inflightRef.current[i] = false;
        console.warn(`[PackSequence] frame ${i} failed`, err);
      }
    };

    const requestPrefetch = (idx: number, direction: number) => {
      const behind = Math.max(0, idx - PREFETCH_BEHIND);
      const ahead = Math.min(FRAME_COUNT - 1, idx + PREFETCH_AHEAD);
      for (let d = 0; d <= Math.max(idx - behind, ahead - idx); d++) {
        const fwd = direction >= 0 ? idx + d : idx - d;
        const bwd = direction >= 0 ? idx - d : idx + d;
        if (fwd >= behind && fwd <= ahead) loadFrame(fwd);
        if (bwd >= behind && bwd <= ahead) loadFrame(bwd);
      }
    };

    const idle: (cb: () => void) => void =
      (window as any).requestIdleCallback
        ? (cb) => (window as any).requestIdleCallback(cb)
        : (cb) => setTimeout(cb, 200);

    const scheduleBackgroundFill = () => {
      if (cancelled) return;
      idle(() => {
        if (cancelled) return;
        let best = -1, bestDist = Infinity;
        for (let i = 0; i < FRAME_COUNT; i++) {
          if (imagesRef.current[i] || inflightRef.current[i]) continue;
          const d = Math.abs(i - currentFrameRef.current);
          if (d < bestDist) { bestDist = d; best = i; }
        }
        if (best < 0) return;
        loadFrame(best).finally(scheduleBackgroundFill);
      });
    };

    // Eager phase
    (async () => {
      console.log(
        `%c[PackSequence] eager phase starting`,
        "color:#e63329;font-weight:bold",
        `${EAGER_COUNT}/${FRAME_COUNT} frames, base=${BASE}`
      );
      const tasks: Promise<void>[] = [];
      for (let i = 0; i < EAGER_COUNT; i++) tasks.push(loadFrame(i));
      await Promise.all(tasks);
      if (cancelled) return;
      eagerDoneRef.current = true;
      eagerLoggedAt = performance.now();
      console.log(
        `%c[PackSequence] eager phase done`,
        "color:#e63329;font-weight:bold",
        `${EAGER_COUNT} frames, ${fmtBytes(bytesTotal)}, ${((eagerLoggedAt - t0) / 1000).toFixed(2)}s`
      );
      scheduleBackgroundFill();
    })();

    const onResize = () => { sizeCanvas(); draw(currentFrameRef.current); };
    window.addEventListener("resize", onResize);

    // Expose helpers via refs for the imperative update below
    (canvas as any).__packDraw = draw;
    (canvas as any).__packPrefetch = requestPrefetch;

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Every time progress changes, pick the frame and trigger a prefetch window.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const p = Math.max(0, Math.min(1, progress));
    const idx = Math.round(p * (FRAME_COUNT - 1));
    const prev = currentFrameRef.current;
    if (idx === prev) return;
    const direction = Math.sign(idx - prev) || 1;
    (canvas as any).__packDraw?.(idx);
    if (eagerDoneRef.current) (canvas as any).__packPrefetch?.(idx, direction);
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

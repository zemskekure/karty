import { useEffect, useRef } from "react";

const FRAME_COUNT = 144;
const EAGER_COUNT = Math.ceil(FRAME_COUNT * 0.15);
const PREFETCH_AHEAD = 12;
const PREFETCH_BEHIND = 4;
// Use Vite's base so the paths resolve both at "/" in dev and "/karty/" on Pages.
const BASE = import.meta.env.BASE_URL;
const framePath = (i: number) =>
  `${BASE}frames/Pack360_1_${String(i).padStart(5, "0")}.png`;

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
    };

    const loadFrame = async (i: number) => {
      if (cancelled) return;
      if (imagesRef.current[i] || inflightRef.current[i]) return;
      inflightRef.current[i] = true;
      try {
        const res = await fetch(framePath(i));
        const blob = await res.blob();
        const bmp = await createImageBitmap(blob);
        if (cancelled) { bmp.close?.(); return; }
        imagesRef.current[i] = bmp;
        if (Math.abs(i - currentFrameRef.current) <= 1) draw(currentFrameRef.current);
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
      const tasks: Promise<void>[] = [];
      for (let i = 0; i < EAGER_COUNT; i++) tasks.push(loadFrame(i));
      await Promise.all(tasks);
      if (cancelled) return;
      eagerDoneRef.current = true;
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

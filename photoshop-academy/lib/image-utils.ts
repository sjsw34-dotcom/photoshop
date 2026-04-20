export interface ProcessedImage {
  blob: Blob;
  thumbDataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

const MAX_LONG_SIDE = 1600;
const THUMB_LONG_SIDE = 320;
const JPEG_QUALITY = 0.82;
const THUMB_QUALITY = 0.7;

function fitContain(
  srcW: number,
  srcH: number,
  maxLongSide: number,
): { w: number; h: number } {
  const long = Math.max(srcW, srcH);
  if (long <= maxLongSide) return { w: srcW, h: srcH };
  const scale = maxLongSide / long;
  return {
    w: Math.round(srcW * scale),
    h: Math.round(srcH * scale),
  };
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("이미지를 불러올 수 없어요"));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawToCanvas(
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D 컨텍스트를 만들 수 없어요");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Blob 변환 실패"));
      },
      type,
      quality,
    );
  });
}

export async function processUpload(file: File): Promise<ProcessedImage> {
  if (typeof document === "undefined") {
    throw new Error("브라우저 환경에서만 작동해요");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 올릴 수 있어요");
  }

  const img = await loadImage(file);
  const fitted = fitContain(img.naturalWidth, img.naturalHeight, MAX_LONG_SIDE);
  const full = drawToCanvas(img, fitted.w, fitted.h);
  const blob = await canvasToBlob(full, "image/jpeg", JPEG_QUALITY);

  const thumbFit = fitContain(fitted.w, fitted.h, THUMB_LONG_SIDE);
  const thumbCanvas = drawToCanvas(img, thumbFit.w, thumbFit.h);
  const thumbDataUrl = thumbCanvas.toDataURL("image/jpeg", THUMB_QUALITY);

  return {
    blob,
    thumbDataUrl,
    width: fitted.w,
    height: fitted.h,
    sizeBytes: blob.size,
  };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)}KB`;
  return `${(n / (1024 * 1024)).toFixed(1)}MB`;
}

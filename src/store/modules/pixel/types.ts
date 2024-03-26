export type PixelCell = { color: string }

export interface PixelCanvas {
  canvasWidth: number;
  canvasHeight: number;
  size: number;
  spacing: number;
  defaultColor: string;
  penColor: string;
  pixels: PixelCell[][]; // status map to canvas
  canvasCtx: any;
}

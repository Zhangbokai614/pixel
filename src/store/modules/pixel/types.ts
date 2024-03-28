export type PixelCell = { color: string, hover: boolean }
export type Cell = { x: number, y: number}

export interface PixelCanvas {
  canvasWidth: number;
  canvasHeight: number;
  size: number;
  spacing: number;
  backgroundColor: string;
  defaultColor: string;
  penColor: string;
  pixels: PixelCell[][]; // status map to canvas
  currentCell: Cell;
  hoverCell: { current: Cell, previous: Cell };
  historyColor: string[];
  historyMax: number;
  clearFlag: boolean;
}

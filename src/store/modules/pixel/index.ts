import { defineStore } from 'pinia';

import { PixelCanvas } from './types';

const usePixelStore = defineStore('pixel', {
  state: (): PixelCanvas => ({
    canvasWidth: 800,
    canvasHeight: 800,
    size: 36,
    spacing: 1,
    defaultColor: '#efefef',
    penColor: '#eeddff',
    pixels: [],
  }),

  getters: {
    getGridSize(): { x: number; y: number; } {
      return {
        x: Math.floor(this.canvasWidth / this.size),
        y: Math.floor(this.canvasHeight / this.size)
      }
    },

    getGridOffset(): { x: number; y: number; } {
      return {
        x: (this.canvasWidth % this.size) / 2,
        y: (this.canvasHeight % this.size) / 2
      }
    },
  },

  actions: {
    initPixels() {
      this.pixels = []

      const grisSize = this.getGridSize
      for (let i = 0; i < grisSize.y; i += 1) {
        const row = []
        
        for (let j = 0; j < grisSize.x; j += 1) {
            row.push({ color: this.defaultColor })
        }
  
        this.pixels.push(row);
      }
    },
  
    screenToGrid(cl: number, ct: number, sx: number, sy: number) {
      const x = sx - cl
      const y = sy - ct

      const gridOffset = this.getGridOffset

      const gridX = Math.floor((x + gridOffset.x) / this.size) 
      const gridY = Math.floor((y + gridOffset.y) / this.size) 
  
      return {gridX, gridY}
    },
  
    draw(cl: number, ct: number, sx: number, sy: number) {
      const gridCell = this.screenToGrid(cl, ct, sx, sy)
      const gridSize = this.getGridSize

      if (gridCell.gridX >= gridSize.x || gridCell.gridY >= gridSize.y) {
        return
      }
  
      this.pixels[gridCell.gridX][gridCell.gridY].color = this.penColor
    },

    changePenColor(color: string) {
      this.penColor = color
    },

    clear() {
      this.initPixels()
    },
  },
});

export default usePixelStore;

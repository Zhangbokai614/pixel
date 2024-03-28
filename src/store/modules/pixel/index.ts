import { defineStore } from 'pinia';

import { PixelCanvas } from './types';

const usePixelStore = defineStore('pixel', {
  state: (): PixelCanvas => ({
    canvasWidth: 800,
    canvasHeight: 800,
    size: 36,
    spacing: 1,
    backgroundColor: '#EFEFEF',
    defaultColor: '#FFFFFF',
    penColor: '#3C7EFF',
    pixels: [],
    currentCell: { x: 0, y: 0 },
    hoverColor: '#A2C2FF',
    hoverCell: { current: { x: 0, y: 0 }, previous: { x: 0, y: 0 } },
    historyColor: [],
    historyMax: 11,
    clearFlag: false,
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
            row.push({ color: this.defaultColor, hover: false })
        }
  
        this.pixels.push(row);
      }
    },
  
    screenToGrid(cl: number, ct: number, sx: number, sy: number) {
      const gridOffset = this.getGridOffset

      const gridX = Math.floor((sx - cl + gridOffset.x) / this.size) 
      const gridY = Math.floor((sy - ct + gridOffset.y) / this.size) 
  
      return { x: gridX, y: gridY}
    },
  
    draw(cl: number, ct: number, sx: number, sy: number) {
      const gridCell = this.screenToGrid(cl, ct, sx, sy)
      const gridSize = this.getGridSize

      if (gridCell.x >= gridSize.x || gridCell.y >= gridSize.y) {
        return
      }
  
      this.updateHistoryColor(this.penColor)

      this.pixels[gridCell.x][gridCell.y].color = this.penColor
      this.currentCell = gridCell
    },

    hover(cl: number, ct: number, sx: number, sy: number) {
      const gridCell = this.screenToGrid(cl, ct, sx, sy)
      const gridSize = this.getGridSize

      if (gridCell.x >= gridSize.x || gridCell.y >= gridSize.y) {
        return
      }
  
      if (gridCell.x === this.hoverCell.current.x && gridCell.y === this.hoverCell.current.y) {
        return
      }

      this.hoverCell.previous = this.hoverCell.current
      this.hoverCell.current = gridCell
    },

    changePenColor(color: string) {
      this.penColor = color
    },

    updateHistoryColor(color: string) {
      const l = this.historyColor.length
      for (let i = 0; i < l; i += 1) {
        if (this.historyColor[i] === color) {
          return
        }
      }

      if (l >= this.historyMax) {
        const historyColor = []
        historyColor.push(color, ...this.historyColor.slice(0, this.historyMax))

        return
      }

      this.historyColor.push(color)
    },

    clear() {
      this.initPixels()
      this.clearFlag = !this.clearFlag
    },
  },
});

export default usePixelStore;

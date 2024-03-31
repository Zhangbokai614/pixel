import { defineStore } from 'pinia';

import { PixelCanvas } from './types';

const usePixelStore = defineStore('pixel', {
  state: (): PixelCanvas => ({
    canvasWidth: 800,
    canvasHeight: 800,
    gridX: 64,
    gridY: 64,
    spacing: 1,
    backgroundColor: '#EFEFEF',
    defaultColor: '#FFFFFF',
    penColor: '#3C7EFF',
    pixels: [],
    currentCell: { x: 0, y: 0 },
    hoverCell: { current: { x: 0, y: 0 }, previous: { x: 0, y: 0 } },
    historyColor: [],
    historyMax: 10,
    clearFlag: false,
  }),

  getters: {
    getCellSize(): { size: number } {
      const count = Math.max(this.gridX, this.gridY)

      return { size: Math.floor(this.canvasWidth / count) }
    },

    getGridOffset(): { x: number; y: number; } {
      return {
        x: (this.canvasWidth - this.getCellSize.size * this.gridX) / 2,
        y: (this.canvasHeight - this.getCellSize.size * this.gridY) / 2
      }
    },
  },

  actions: {
    initPixels() {
      this.pixels = []

      for (let i = 0; i < this.gridX; i += 1) {
        const row = []
        
        for (let j = 0; j < this.gridY; j += 1) {
            row.push({ color: this.defaultColor, hover: false })
        }
  
        this.pixels.push(row);
      }
    },
  
    screenToGrid(cl: number, ct: number, sx: number, sy: number) {
      const gridOffset = this.getGridOffset

      const gridX = Math.floor((sx - (cl + gridOffset.x)) / this.getCellSize.size) 
      const gridY = Math.floor((sy - (ct + gridOffset.y)) / this.getCellSize.size) 
  
      return { x: gridX, y: gridY}
    },
  
    draw(cl: number, ct: number, sx: number, sy: number) {
      const gridCell = this.screenToGrid(cl, ct, sx, sy)

      if (gridCell.x >= this.gridX || gridCell.x < 0 || gridCell.y >= this.gridY || gridCell.y < 0) {
        return
      }
  
      this.updateHistoryColor(this.penColor)

      this.pixels[gridCell.x][gridCell.y].color = this.penColor
      this.currentCell = gridCell
    },

    hover(cl: number, ct: number, sx: number, sy: number) {
      const gridCell = this.screenToGrid(cl, ct, sx, sy)

      if (gridCell.x >= this.gridX || gridCell.x < 0 || gridCell.y >= this.gridY || gridCell.y < 0) {
        return
      }

      if (gridCell.x >= this.gridX || gridCell.y >= this.gridY) {
        return
      }
  
      if (gridCell.x === this.hoverCell.current.x && gridCell.y === this.hoverCell.current.y) {
        return
      }

      this.hoverCell.previous = this.hoverCell.current
      this.hoverCell.current = gridCell
    },

    changeGridX(x: number) {
      this.gridX = x

      this.initPixels()
    },

    changeGridY(y: number) {
      this.gridY = y

      this.initPixels()
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

      const historyColor = []
      historyColor.push(color, ...this.historyColor.slice(0, this.historyMax))
      this.historyColor = historyColor
    },

    clear() {
      this.initPixels()
      this.clearFlag = !this.clearFlag
    },

    reRender() {
      this.clearFlag = !this.clearFlag
    },
  },
});

export default usePixelStore;

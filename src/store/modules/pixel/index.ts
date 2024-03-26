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
    canvasCtx: {},
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
    initCanvas() {
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

    clear() {
      this.initCanvas()
    },
  },
});

export default usePixelStore;

<template>
  <div class="pixels">
    <a-space class="pixel-info" direction="vertical" fill>
      <a-typography-text type="secondary">{{ `(
        x: ${gridSize.x}, 
        y: ${gridSize.y}, 
      )`}}</a-typography-text>
      <a-typography-text type="secondary">{{ `(
        x: ${hoverCell.current.x}, 
        y: ${hoverCell.current.y}, 
        color: ${pixels[hoverCell.current.x][hoverCell.current.y].color}
      )`}}</a-typography-text>
    </a-space>
    <canvas
      ref="canvas"
      :style="{backgroundColor: backgroundColor }"
      :width=canvasWidth
      :height=canvasHeight
    >
    </canvas>
    <p class="spacing"></p>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { usePixelStore } from '@/store';
 
  const props = defineProps(['canvasWidth', 'canvasHeight', 'size', 'spacing'])
  const { canvasWidth, canvasHeight, size, spacing } = props
  
  const pixelStore = usePixelStore()
  const gridOffset = pixelStore.getGridOffset
  const gridSize = pixelStore.getGridSize

  let { pixels, currentCell, hoverCell, clearFlag, backgroundColor, penColor } = pixelStore

  const canvas = ref()
  const canvasCtx = ref()

  const fillCell = (ctx: any, x: number, y: number, color: string) => {
    const cellX = gridOffset.x + x * size
    const cellY = gridOffset.y + y * size
    const fillSize = size - spacing

    canvasCtx.value.fillStyle = color

    ctx.fillRect(cellX, cellY, fillSize, fillSize);
  }

  const render = () => {
    for (let i = 0; i < pixels.length; i += 1) {
      for (let j = 0; j < pixels[i].length; j += 1) {
        fillCell(canvasCtx.value, i, j, pixels[i][j].color)
      }
    }
  }

  const borderCell = (ctx: any, x: number, y: number) => {
    const cellX = gridOffset.x + x * size - (spacing * 0.5)
    const cellY = gridOffset.y + y * size - (spacing * 0.5)
    const strokeSize = size

    canvasCtx.value.strokeStyle = penColor

    ctx.strokeRect(cellX, cellY, strokeSize, strokeSize);
  }

  const clearBorderCell = (ctx: any, x: number, y: number) => {
    const cellX = gridOffset.x + x * size - (spacing * 0.5)
    const cellY = gridOffset.y + y * size - (spacing * 0.5)
    const strokeSize = size

    canvasCtx.value.strokeStyle = backgroundColor

    ctx.strokeRect(cellX, cellY, strokeSize, strokeSize);
  }

  const hover = () => {
    clearBorderCell(canvasCtx.value, hoverCell.previous.x, hoverCell.previous.y)
    borderCell(canvasCtx.value, hoverCell.current.x, hoverCell.current.y)
  }

  const draw = () => {
    const { x, y } = currentCell

    fillCell(canvasCtx.value, x, y, pixels[x][y].color)
  }

  const initPen = () => {
    canvasCtx.value.lineWidth = pixelStore.spacing
  }

  onMounted(() => {  
    canvasCtx.value = canvas.value.getContext('2d')
    
    initPen()
    render()
  })

  pixelStore.$subscribe((_, state) => {
    pixels = state.pixels
    currentCell = state.currentCell

    hoverCell = state.hoverCell
    penColor = state.penColor
    backgroundColor = state.backgroundColor
    
    if (hoverCell.current !== hoverCell.previous) {
      hover()
    }

    if (clearFlag === state.clearFlag) {
      draw()

    } else {
      clearFlag = state.clearFlag

      render()
    }
  })

</script>

<script lang="ts">
  export default {
    name: 'Pixel',
  };
</script>

<style lang="less" scoped>
  .pixels {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 100%;
    margin-left: auto
  }

  .spacing {
    flex: 1;
  }

  .pixel-info {
    flex: 1;
    text-align: left;
    align-self: flex-end;
    margin: 16px;
  }
  
</style>
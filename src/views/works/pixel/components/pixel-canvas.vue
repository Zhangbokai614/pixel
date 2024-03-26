<template>
  <div class="pixels">
    <canvas
      ref="canvas"
      :style="{backgroundColor: '#ffffff' }"
      :width=canvasWidth
      :height=canvasHeight
      @mousemove="draw"
      @click="draw"
      @mousedown="penDown"
      @mouseup="penUp"
    >
    </canvas>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { usePixelStore } from '@/store';
 
  const props = defineProps(['canvasWidth', 'canvasHeight', 'size', 'spacing', 'penColor'])
  const { canvasWidth, canvasHeight, size, spacing, penColor } = props
  
  const pixelStore = usePixelStore()
  const gridSize = pixelStore.getGridSize
  const gridOffset = pixelStore.getGridOffset

  let { pixels } = pixelStore

  const canvas = ref()
  const pen = ref(false)

  const penDown = () => {
    pen.value = true
  }

  const penUp = () => {
    pen.value = false
  }

  const drawCell = (ctx: any, x: number, y: number) => {
    const fillSize = size - spacing

    ctx.fillRect(x, y, fillSize, fillSize);
  }

  const fillCell = (ctx: any, x: number, y: number, color: string) => {
    pixelStore.canvasCtx.fillStyle = color

    drawCell(ctx, gridOffset.x + x * size, gridOffset.y + y * size)
  }

  const render = () => {
    pixelStore.canvasCtx.lineWidth = pixelStore.spacing

    for (let i = 0; i < pixels.length; i += 1) {
      for (let j = 0; j < pixels[i].length; j += 1) {
        fillCell(pixelStore.canvasCtx, i, j, pixels[i][j].color)
      }
    }
  }

  const screenToCanvas = (screenX: number, screenY: number) => {
    const cr = canvas.value.getBoundingClientRect()

    return {
      x: screenX - cr.left, 
      y: screenY - cr.top
    }
  }

  const canvasToGrid = (x: number, y: number) => {
    const gridX = Math.floor((x + gridOffset.x) / size) 
    const gridY = Math.floor((y + gridOffset.y) / size) 

    return {gridX, gridY}
  }

  const draw = (e: any) => {
    if (!pen.value && e.pointerType !== 'mouse') {
      return
    }

    const canvasP = screenToCanvas(e.clientX, e.clientY)
    const gridCell = canvasToGrid(canvasP.x, canvasP.y)

    if (gridCell.gridX >= gridSize.x || gridCell.gridY >= gridSize.y) {
      return
    }

    pixels[gridCell.gridX][gridCell.gridY].color = penColor
    fillCell(pixelStore.canvasCtx, gridCell.gridX, gridCell.gridY, penColor)
  }

  onMounted(() => {
    pixelStore.canvasCtx = canvas.value.getContext('2d')
    
    render()
  })

  pixelStore.$subscribe((mutation, state) => {
    pixels = state.pixels
    render()
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 100%;
  }
  
</style>
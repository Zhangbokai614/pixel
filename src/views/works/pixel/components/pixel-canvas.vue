<template>
  <div class="pixels">
    <canvas
      class="pixel-canvas"
      ref="canvas"
      :width=canvasWidth
      :height=canvasHeight
      @mousemove="draw"
      @mousedown="penDown"
      @mouseup="penUp"
      @mouseleave="penUp"
    >
    </canvas>
  </div>
  <a-button type="primary" @click="clear">
      <template #icon>
        <icon-delete />
      </template>
      <!-- Use the default slot to avoid extra spaces -->
      <template #default>Clear</template>
  </a-button>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
 
  type Item = { color: string, size: number }

  const canvasWidth = 800
  const canvasHeight = 800
  const size = 36
  const spacing = 1
  const defaultColor = '#cfcfcf'
  const penColor = '#ffeecc'

  const x = Math.floor(canvasWidth / size)
  const y = Math.floor(canvasHeight / size)
  const offsetX = (canvasWidth % size) / 2
  const offsetY = (canvasHeight % size) / 2

  const pixels = ref<Item[][]>([])
  const canvas = ref()
  const ctx = ref()
  const pen = ref(false)

  const penDown = () => {
    pen.value = true
  }

  const penUp = () => {
    pen.value = false
  }

  const drawRect = (ctx: any, x: number, y: number, size: number) => {
    ctx.value.fillRect(x, y, size, size);
  }

  const initCanvas = () => {
    ctx.value.fillStyle = defaultColor
    ctx.value.lineWidth = spacing

    for (let i = 0; i < y; i += 1) {
      const row = []

      for (let j = 0; j < x; j += 1) {
        row.push({ color: defaultColor, size })
        
        drawRect(ctx, offsetX + i * size, offsetY + j * size, size - spacing)
      }

      pixels.value.push(row);
    }
  }

  const clear = () => {
    pixels.value = []
    initCanvas()
  }

  const screenToCanvas = (screenX: number, screenY: number) => {
    const cr = canvas.value.getBoundingClientRect()

    return {
      x: screenX - cr.left, 
      y: screenY - cr.top}
  }

  const canvasToGrid = (x: number, y: number) => {
    const gridX = Math.floor((x + offsetX) / size) 
    const gridY = Math.floor((y + offsetY) / size) 

    return {gridX, gridY}
  }

  const fillCell = (ctx: any, x: number, y: number) => {
    drawRect(ctx, offsetX + x * size, offsetY + y * size, size - spacing)
  }

  const draw = (e: any) => {
    if (!pen.value) {
      return
    }

    const canvasP = screenToCanvas(e.clientX, e.clientY)
    const gridCell = canvasToGrid(canvasP.x, canvasP.y)

    if (gridCell.gridX >= x || gridCell.gridY >= y) {
      return
    }

    ctx.value.fillStyle = penColor
    fillCell(ctx, gridCell.gridX, gridCell.gridY)
  }

  onMounted(() => {
    ctx.value = canvas.value.getContext('2d')
    
    initCanvas()
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

  .pixel-canvas {
    background-color: #ffffff;
  }
  
</style>
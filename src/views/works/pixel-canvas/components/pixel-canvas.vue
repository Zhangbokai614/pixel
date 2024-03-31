<template>
  <div class="pixels">
    <p class="spacing"></p>
    <a-space class="pixel-info" direction="vertical" fill :style="{ zIndex: 1 }">
      <a-typography-text type="secondary">{{ `(
        x: ${pixelStore.gridX}, 
        y: ${pixelStore.gridY}, 
      )`}}</a-typography-text>
      <a-typography-text type="secondary">{{ `(
        x: ${hoverCell.current.x}, 
        y: ${hoverCell.current.y}, 
        color: ${pixels[hoverCell.current.x][hoverCell.current.y].color}
      )`}}</a-typography-text>
    </a-space>
    <canvas
      ref="canvas"
      :style="{ backgroundColor: backgroundColor, zIndex: 0 }"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="mouseDown"
      @mousemove="mouseMove"
      @mouseup="mouseUp"
      @mouseleave="mouseUp"
    >
    </canvas>
    <a-col class="window-left" >
      <a-input-number
        v-model="scale"
        :style="{width:'160px', margin: '16px'}" 
        :default-value="1" 
        :precision="2"
        :step="0.1"
        :max="8"
        :min="0.2"
        :formatter="(v: number) => { return `${v * 100}%` }"
        :parser="(v: string) => { return  (Number(v.replace('%', '')) / 100).toFixed(2) }"
        placeholder="zoom" 
        mode="button" 
        size="large" 
        @change="zoom"
        @click.stop
      />
    </a-col>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import { usePixelCanvasStore } from '@/store';
 
  const props = defineProps(['canvasWidth', 'canvasHeight', 'spacing', 'currentTools'])
  const { canvasWidth, canvasHeight, spacing } = props
  const currentTools = computed(() => {
    return props.currentTools
  })
  
  const pixelStore = usePixelCanvasStore()
  const gridOffset = pixelStore.getGridOffset
  const { size } = pixelStore.getCellSize

  let { pixels, currentCell, hoverCell, clearFlag, backgroundColor, penColor } = pixelStore

  const canvas = ref()
  const canvasCtx = ref()

  const scale = ref(1)
  const isCatch = ref(false)
  const catchPoint = ref({ x: 0, y: 0 })
  const translate = ref({ x: 0, y: 0 })

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

  const translateCanvas = () => {
    canvas.value.style.transform = `translate(${translate.value.x}px, ${translate.value.y}px) scale(${scale.value})`
  }

  const zoom = () => {
    scale.value = Math.max(0.5, Math.min(scale.value, 8));
    translateCanvas()
  }

  const mouseWheelZoom = (e: any) => {
    e.preventDefault(); 
    const delta = Math.max(-1, Math.min(1, e.deltaY)); 
    scale.value -= delta * 0.1;
    zoom()
  }

  const catchCanvas = (x: number, y: number) => {
    catchPoint.value = { x, y }
  }

  const mouseDown = (e: any) => {
    if (currentTools.value === 'grab') {
      catchCanvas(e.clientX, e.clientY)
      isCatch.value = true
    }
  }

  const mouseMove = (e: any) => {
    if (isCatch.value) {
      translate.value.x += e.clientX - catchPoint.value.x
      translate.value.y += e.clientY - catchPoint.value.y

      catchCanvas(e.clientX, e.clientY)
      translateCanvas()
    }
  }

  const mouseUp = (e: any) => {
    isCatch.value = false
  }

  onMounted(() => {  
    canvasCtx.value = canvas.value.getContext('2d')
    
    initPen()
    render()

    canvas.value.addEventListener('wheel', (e: any) => {
      mouseWheelZoom(e)
    });
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
    justify-content: start;
    align-items: center;
    flex: 1;
    height: 100%;
    margin-left: auto
  }

  .spacing {
    flex: 1;
  }

  .pixel-info {
    position: absolute;
    text-align: left;
    align-self: flex-end;
    margin: 16px;
  }
  
  .window-left {
    display: flex;
    justify-content: end;
    align-self: flex-start;
    flex: 1;
  }
  
</style>
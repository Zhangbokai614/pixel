<template>
  <div class="pixels">
    <canvas
      ref="canvas"
      :style="{backgroundColor: '#ffffff' }"
      :width=canvasWidth
      :height=canvasHeight
    >
    </canvas>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { usePixelStore } from '@/store';
 
  const props = defineProps(['canvasWidth', 'canvasHeight', 'size', 'spacing'])
  const { canvasWidth, canvasHeight, size, spacing } = props
  
  const pixelStore = usePixelStore()
  const gridOffset = pixelStore.getGridOffset

  let { pixels, penColor } = pixelStore

  const canvas = ref()
  const canvasCtx = ref()

  const drawCell = (ctx: any, x: number, y: number) => {
    const fillSize = size - spacing

    ctx.fillRect(x, y, fillSize, fillSize);
  }

  const fillCell = (ctx: any, x: number, y: number, color: string) => {
    canvasCtx.value.fillStyle = color

    drawCell(ctx, gridOffset.x + x * size, gridOffset.y + y * size)
  }

  const render = () => {
    for (let i = 0; i < pixels.length; i += 1) {
      for (let j = 0; j < pixels[i].length; j += 1) {
        fillCell(canvasCtx.value, i, j, pixels[i][j].color)
      }
    }
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
    penColor = state.penColor
    
    canvasCtx.value.fillStyle = state.penColor

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
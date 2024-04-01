<template>
  <div class="pixels">
    <p class="spacing"></p>
    <a-space class="pixel-info" direction="vertical" fill :style="{ zIndex: 1 }">
      <!-- <a-typography-text type="secondary">{{ `(
        x: ${pixelStore.gridX}, 
        y: ${pixelStore.gridY}, 
      )`}}</a-typography-text> -->
    </a-space>
    <canvas
      ref="canvas"
      :style="{ backgroundColor: backgroundColor, zIndex: 0 }"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="mouseDown"
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
 
  const props = defineProps(['canvasWidth', 'canvasHeight', 'spacing'])
  const { canvasWidth, canvasHeight } = props
  
  const pixelStore = usePixelCanvasStore()
  const { backgroundColor } = pixelStore

  const canvas = ref()
  const canvasCtx = ref()

  const scale = ref(1)
  const isCatch = ref(false)
  const catchPoint = ref({ x: 0, y: 0 })
  const translate = ref({ x: 0, y: 0 })
  const currentTools = ref('pen')

  const draw = (e: any) => {
    let x = e.offsetX
    let y = e.offsetY

    x -= x % 4
    y -= y % 4
  
    canvasCtx.value.fillStyle = '#ff2200'
    canvasCtx.value.fillRect(x - 2, y - 2, 4, 4)
  }

  const initPen = () => {
    // canvasCtx.value.lineWidth = 4
    // canvasCtx.value.lineCap = 'square'
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
    canvas.value.onmousemove = (e: any) => {
      switch(currentTools.value) {
        case 'grab':
          catchCanvas(e.clientX, e.clientY)

          translate.value.x += e.clientX - catchPoint.value.x
          translate.value.y += e.clientY - catchPoint.value.y
          translateCanvas()

          break
        case 'pen':
          draw(e)

          break
        default:
      }
    }

    canvas.value.onmouseup = () => {
      isCatch.value = false

      canvas.value.onmousemove = null
      canvas.value.onmouseup = null
      canvas.value.onmousleave = null
    }

    canvas.value.onmousleave = () => {
      canvas.value.onmousemove = null
      canvas.value.onmouseup = null
      canvas.value.onmousleave = null
    }
  }

  onMounted(() => {  
    canvasCtx.value = canvas.value.getContext('2d', {willReadFrequently: true})
    
    initPen()

    canvas.value.addEventListener('wheel', (e: any) => {
      mouseWheelZoom(e)
    });
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
    margin-left: auto;
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
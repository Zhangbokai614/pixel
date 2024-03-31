<template>
  <div class="container">
    <div class="pixel-canvas">
      <PixelCanvas 
        v-if="!load" 
        :canvas-height="pixelStore.canvasHeight"
        :canvas-width="pixelStore.canvasWidth"
        :spacing="pixelStore.spacing"
        :currentTools="currentTools"
        :style="{ cursor: currentTools }"
        @mousemove="mouseHandler"
        @click="mouseHandler"
        @mousedown.stop="mouseDown"
        @mouseup.stop="mouseUp"
        @mouseleave.stop="mouseUp"
      />
    </div>
    <div class="tools">
      <a-space direction="vertical" :style="{ margin: '8px' }">
        <a-color-picker
          :defaultValue="pixelStore.penColor" 
          :v-mode="pixelStore.penColor"
          :history-colors="pixelStore.historyColor"
          :style="{ width: '100%', boxShadow: '0 0 0'}"
          size="medium"
          hideTrigger 
          showHistory 
          @change="pixelStore.changePenColor"
        />
        <a-divider orientation="center" :style="{ marginTop: '32px' }">Tools</a-divider>
        <a-space>
          <a-button type="primary" @click="switchTools('pen')">
            <template #icon>
              <icon-pen />
            </template>
          </a-button>
          <a-button type="primary" @click="switchTools('grab')">
            <template #icon>
              <icon-drag-arrow />
            </template>
          </a-button>
        </a-space>
        <input type="file" @change="file" ref="fileData"/>
      </a-space>
      <a-button type="primary" status="danger" @click="pixelStore.clear" class="clear-button">
        <template #icon>
          <icon-delete />
        </template>
        <template #default>Clear</template>
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { usePixelCanvasStore } from '@/store';
  import PixelCanvas from './components/pixel-canvas.vue';

  const toolsMouse = new Map([
    ['pen', 'crosshair'],
    ['grab', 'grab'],
  ])

  const pixelStore = usePixelCanvasStore()
  const fileData = ref()
  const load = ref(true)
  const pen = ref(false)
  const currentTools = ref(toolsMouse.get('pen'))
  const pElem = ref()

  const switchTools = (tools: string) => {
    currentTools.value = toolsMouse.get(tools)
  }

  const mouseDown = () => {
    if (currentTools.value === toolsMouse.get('pen')) {
      pen.value = true
    }
  }

  const mouseUp = () => {
    if ((currentTools.value === toolsMouse.get('pen'))) {
      pen.value = false
    }
  }

  const mouseHandler = (e: any) => {
    switch(currentTools.value) {
      case toolsMouse.get('pen'):
        draw(e)
        break
      case toolsMouse.get('grab'):
      default:
    }
  }

  const draw = (e: any) => {
    const domRect = pElem.value[0].getBoundingClientRect()
    pixelStore.canvasWidth = domRect.width
    pixelStore.canvasHeight = domRect.height

    if (!pen.value && e.pointerType !== 'mouse') {
      pixelStore.hover(domRect.x, domRect.y,  e.clientX, e.clientY)

      return
    }

    pixelStore.draw(domRect.x, domRect.y,  e.clientX, e.clientY)
  }

  document.addEventListener('keydown', (e: any) => {
    if (e.code === 'Space') {
      e.preventDefault(); 

      switchTools('grab')
    }

    document.addEventListener('keyup', (e: any) => {
      if (e.code === 'Space') {
        switchTools('pen')
      }
    })
  })

  const getPixel = (width: number, x: number, y: number, interval: number) => {
    return (((width * y) +  x) * (interval + 4))
  }

  const imageDataToPixels = (data: Uint8ClampedArray) => {
    const { canvasWidth, canvasHeight } = pixelStore
    const interval = Math.floor(Math.max(canvasWidth, canvasHeight) / pixelStore.gridX)

    for (let i = 0; i < pixelStore.gridY; i += 1) {
      const row = []

      for (let j = 0; j < pixelStore.gridX; j += 1) {
        const start = getPixel(canvasWidth, i, j, interval)
        const r = data[start]
        const g = data[start + 1]
        const b = data[start + 2]
        const a = data[start + 3]

        if (r === g && g === b && b === 255) {
          console.log(start, data[start])
        }

        row.push({hover: false, color: `rgba(${r}, ${g}, ${b}, ${a})`})
      }

      pixelStore.pixels[i] = row
    }

    pixelStore.reRender()
  }

  function filetoCanvas(file: File){
    const reader = new FileReader()
    reader.onloadend = function(e){
      const img = new Image()
      img.onload = function() {
        const canvas = document.createElement("canvas")
        // const canvas = pElem.value[0]
        const ctx = canvas.getContext('2d')

        ctx!.drawImage(img, 0, 0, canvas.width, canvas.height)

        const data = ctx?.getImageData(0, 0, pixelStore.canvasWidth, pixelStore.canvasHeight).data
        if (data) {
          imageDataToPixels(data)
        }
        
      };

      img.src = e.target!.result?.toString() || ''
    };

    reader.readAsDataURL(file)
  };

  const file = () => {
    pixelStore.clear()
    filetoCanvas(fileData.value.files[0])
  }

  onMounted(() => {
    load.value = false

    pElem.value  = document.getElementsByTagName("canvas")

    pixelStore.initPixels()
  }) 

</script>

<script lang="ts">
  export default {
    name: 'Pixel', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    height: calc(~"100vh - 100px"); // 100px = footer(40) + navbar(60)  
  }

  .pixel-canvas {
    display: flex;
    flex: 1;
    overflow: auto;
    height: 100%;
    width: calc(~"100vh - 100px");
    background-color: var(--color-fill-4);
  }

  .tools {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 280px;
    margin-left: 16px;
    background-color: #FFFFFF;
  }

  .form-item {
    box-shadow: inset;
  }

  .clear-button{
    align-self: flex-end;
  }

</style>

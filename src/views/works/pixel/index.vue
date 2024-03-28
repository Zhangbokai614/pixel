<template>
  <div class="container">
    <div class="pixel-canvas" >
      <PixelCanvas 
        v-if="!load" 
        v-bind="pixelStore.$state"
        @mousemove="draw"
        @click="draw"
        @mousedown="penDown"
        @mouseup="penUp"
        @mouseleave="penUp"
      />
    </div>
    <div class="tools">
      <a-color-picker
        :defaultValue="pixelStore.penColor" 
        :v-mode="pixelStore.penColor"
        :history-colors="pixelStore.historyColor"
        :style="{ width: '100%' }"
         hideTrigger 
         showHistory 
         showPreset
         @change="pixelStore.changePenColor"
      />
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
  import { usePixelStore } from '@/store';
  import PixelCanvas from './components/pixel-canvas.vue';

  const pixelStore = usePixelStore()
  const load = ref(true)
  const pen = ref(false)

  const penDown = () => {
    pen.value = true
  }

  const penUp = () => {
    pen.value = false
  }

  const draw = (e: any) => {
    const pElem = document.getElementsByTagName("canvas")[0]
    if (pElem === null) {
      return
    }
    const domRect = pElem.getBoundingClientRect()

    if (!pen.value && e.pointerType !== 'mouse') {
      pixelStore.hover(domRect.x, domRect.y,  e.clientX, e.clientY)

      return
    }

    pixelStore.draw(domRect.x, domRect.y,  e.clientX, e.clientY)
  }

  onMounted(() => {
    load.value = false

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
    background-color: var(--color-fill-4);
  }

  .clear-button{
    align-self: flex-end;
  }

</style>


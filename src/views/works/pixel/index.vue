<template>
  <div class="container">
    <div class="pixel-canvas" >
      <PixelCanvas v-if="!load" v-bind="pixelStore.$state"/>
    </div>
    <div class="right-side">
      <a-button type="primary" @click="pixelStore.clear">
        <template #icon>
          <icon-delete />
        </template>
        <!-- Use the default slot to avoid extra spaces -->
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
  const canvasConfig = ref(pixelStore.$state)
  const load = ref(true)

  onMounted(() => {
    load.value = false

    pixelStore.initCanvas()
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

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

</style>


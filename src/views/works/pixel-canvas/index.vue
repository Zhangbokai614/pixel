<template>
  <div class="root">
    <a-split  class="left" direction="vertical" default-size="0.8" :style="{height: '100%'}">
      <template #first>
          <PixelCanvas
            class="pixel-canvas"
            :canvas-width="600"
            :canvas-height="600"
          />
      </template>
      <template #second>
        <div class="layer"></div>
      </template>
    </a-split>
    <div class="tools"></div>
  </div>
</template>

<script lang="ts" setup>
  import PixelCanvas from './components/pixel-canvas.vue';
</script>

<script lang="ts">
  export default {
    name: 'Pixel', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .root {
    display: flex;
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    height: 100vh; // 100px = footer(40) + navbar(60)  
  }

  .left {
    flex: 1;
  }

  .pixel-canvas {
    display: flex;
    overflow: auto;
    height: 100%;
    width: 100%;
    background-color: var(--color-fill-4);
  }

  .layer {
    height: 100%;
    background-color: var(--color-fill-4);
  }

  .tools {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 18%;
    height: 100%;
    margin-left: 8px;
    background-color: var(--color-fill-4);
  }

</style>

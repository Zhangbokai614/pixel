<template>
  <div class="container">
    <div class="pixel-canvas">
      <PixelCanvas />
    </div>
    <div class="right-side">

    </div>
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
  .container {
    background-color: var(--color-fill-2);
    padding: 16px 20px;
    padding-bottom: 0;
    display: flex;
    height: calc(~"100vh - 100px"); // 100px = footer(40) + navbar(60)  
  }

  .pixel-canvas {
    flex: 1;
    overflow: auto;
    height: 100%;
    background-color: var(--color-fill-3);
  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;
    }
    .right-side {
      // display: none;
      width: 100%;
      margin-left: 0;
      margin-top: 16px;
    }
  }
</style>

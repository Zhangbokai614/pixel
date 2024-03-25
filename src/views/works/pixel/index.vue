<template>
  <div class="container">
    <div class="pixel-canvas">
      <PixelDiv />
    </div>
    <div class="right-side">

    </div>
  </div>
</template>

<script lang="ts" setup>
  import PixelDiv from './components/pixel-div.vue';
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


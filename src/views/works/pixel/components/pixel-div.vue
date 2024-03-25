<template>
  <div class="pixels" draggable="false" @mousedown="penDown()" @mouseup="penUp()" @click="penUp()" @mouseleave="penUp()">
    <div class="row" draggable="false" v-for="row, i in pixels" :key="i" :style="{ height: row[0].size + 'px' }">
      <div class="item" draggable="false" v-for="item, j in row" :key="j" :style="{ padding: spacing + 'px '}">
        <canvas
          class="pixel" 
          draggable="false"
          :style="{
            width: item.size - spacing + 'px',
            height: item.size - spacing + 'px',
            backgroundColor: item.color,
          }"
          @mouseenter="draw(i, j, 'blue')"
          @mousedown="fill(i, j, 'blue')"
        >
        </canvas>
      </div>
    </div>
  </div>

  <div class="tools" @click="clear()">
    <a-button type="primary" @click="clear()">
      <template #icon>
        <icon-delete />
      </template>
      <template #default>Clear</template>
    </a-button>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  type Item = { color: string, size: number }

  const x = 24
  const y = 24
  const size = 24
  const color = '#ffffff'
  const spacing = 0.5
  const pixels = ref<Item[][]>([])
  const pen = ref(false)

  const init = () => {
    for (let i = 0; i < y; i += 1) {
      const row = []

      for (let j = 0; j < x; j += 1) {
        row.push({ color, size })
      }

      pixels.value.push(row);
    }
  }
  init()

  const pe = document.querySelector(".pixels");
  pe?.addEventListener('click', (e) => {
    console.log(e)
  })

  const penDown = () => {
    pen.value = true
  }

  const penUp = () => {
    pen.value = false
  }

  const fill = (x: number, y: number, color: string) => {
    pixels.value[x][y].color = color
  }

  const draw = (x: number, y: number, color: string) => {
    if (!pen.value) {
      return
    }

    fill(x, y, color)
  }

  const clear = () => {
    pixels.value = []
    init()
  }

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

  .row {
    display: flex;
    flex-direction: row;
  }

  .pixel:hover {
    border-width: 1px;
    border-color: var(--color-fill-4);
    border-style: inset;
  }
</style>
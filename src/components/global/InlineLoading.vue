<template>
  <p>{{ text }}{{ printedDots }}</p>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    text: {
      type: String,
      default: () => 'Loading',
    },
  },
  data() {
    return {
      dots: 0,
    } as {
      dots: Number
    }
  },
  computed: {
    printedDots() {
      let ret: String = ''
      for (let i = 0; i <= this.dots; i++) {
        ret += '.'
      }
      return ret
    },
  },
  watch: {
    dots() {
      if (this.dots > 2) {
        this.dots = 0
      }
    },
  },
  mounted() {
    setInterval(() => {
      this.dots += 1
    }, 500)
  },
})
</script>

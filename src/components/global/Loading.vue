<template>
  <div class="loading-wrapper">
    <div class="loading-ring"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      loadVal: 0,
      interval: 1,
    } as {
      loadVal: number
      interval: number
    }
  },
  watch: {
    loadVal(newVal) {
      if (newVal > 99) {
        this.interval = -1
      } else if (newVal < 1) {
        this.interval = 1
      }
    },
  },
  mounted() {
    setInterval(() => {
      this.loadVal += this.interval
    }, 10)
  },
})
</script>

<style lang="scss" scoped>
.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
}

.loading-ring {
  display: inline-block;
  width: 64px;
  height: 64px;
}

.loading-ring::after {
  display: block;
  width: 46px;
  height: 46px;
  margin: 1px;
  content: ' ';
  border: 5px solid #000;
  border-color: #000 transparent #000 transparent;
  border-radius: 50%;
  animation: loading-ring 1.2s linear infinite;
}

@keyframes loading-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

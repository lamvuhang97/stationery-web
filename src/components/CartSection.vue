<template>
    <div class="cart-section">
        <div class="header">
            <div class="select">
                <input type="checkbox">
            </div>
            <div class="owner">
                <span>{{owner}}</span>
            </div>
        </div>
        <div class="section-item">
            <cart-item v-for="(item, ind) in listCart" :key="ind" :data="item"></cart-item>
        </div>
    </div>
</template>
<script>
import CartItem from './CartItem.vue'
export default {
  components: { CartItem },
  props: {
      listCart: {
          type: Array,
          default: null
      },
      owner: {
          type: String,
          default: ""
      }
  },
  mounted() {
  }
    
}
</script>
<style scoped>
    .cart-section .header{
        display: flex;
    }
</style>
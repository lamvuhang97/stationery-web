<template>
    <div class="cart-section">
        <div class="header">
            <div class="select">
                <input type="checkbox">
            </div>
            <router-link :to="{name: 'User', params: {id : listCart[0].product.ownerId}}" class="nav-link owner">
                <i class="fas fa-store"></i>
                <span>{{owner}}</span>
            </router-link>
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
        align-items: center;
    }
    .owner {
        padding-left: 15px;
        display: flex;
    }
    .owner span {
        padding-left: 5px;
    }
</style>
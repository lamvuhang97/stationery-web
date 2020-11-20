<template>
    <div class="cart-section">
        <div class="header">
            <div class="select">
                <input type="checkbox" :checked="checked" @click="clickAll">
            </div>
            <router-link :to="{name: 'User', params: {id : listCart[0].product.ownerId}}" class="nav-link owner">
                <i class="fas fa-store"></i>
                <span>{{owner}}</span>
            </router-link>
        </div>
        <div class="section-item">
            <cart-item 
                v-for="(item, ind) in listCart" 
                :key="ind" 
                :data="item" 
                :is-check-all="isCheckAll"
                @click-item="clickItem"
                @delete-cart="deleteCart"
            ></cart-item>
        </div>
    </div>
</template>
<script>
import CartItem from './CartItem.vue'
export default {
  components: { CartItem },
  data() {
      return {
          isCheckAll: false,
          listSelected: [],
          checked: false
      }
  },
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
  methods: {
      clickAll(e) {
          if(e.target.checked == true) {
              this.isCheckAll = true
              this.listSelected =[]
              this.listSelected = this.listCart
          } else {
              this.isCheckAll = false
              this.listSelected =[]
          }
          if(this.listSelected.length == this.listCart.length) {
              this.checked = true
          } else {
              this.checked = false
          }
      },
      clickItem(params) {
          if(params.checked == true) {
              this.listCart.forEach((item) => {
                  if(item.product.name == params.value) {
                      this.listSelected.push(item)
                  }
              })
          } else {
              this.listSelected.forEach((item, ind) => {
                  if(item.product.name == params.value ) {
                      this.listSelected.splice(ind, 1)
                  }
              })
          }
          if(this.listSelected.length == this.listCart.length) {
              this.checked = true
          } else {
              this.checked = false
          }
      },
      deleteCart(id) {
          this.$emit('delete-cart', id)
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
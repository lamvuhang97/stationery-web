<template>
    <div class="cart-section">
        <div class="header">
            <div class="select">
                <input type="checkbox" v-model="allSelected">
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
                :select-all="allSelected"
                @select-item="SelectItem"
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
          allSelected: false,
          selectedList:[]
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
      SelectItem(params) {
          console.log("params",params);
          if(params.selected == true) {
              this.selectedList.push(params.value)
          } else {
              this.selectedList.forEach((item, ind) => {
                  if(item == params.value) {
                      this.selectedList.splice(ind, 1)
                  }
              })
          }
          console.log("khd",this.selectedList);
          if(this.selectedList.length == this.listCart.length) {
              this.allSelected = true
          } else {
              this.allSelected = false
          }
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
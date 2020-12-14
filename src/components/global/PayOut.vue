<template>
  <div class="modal-background" @click="$emit('no')">
    <div class="modal-content">
      <div class="modal-body" @click.stop>
        <!-- <div class="modal-header">
          <p v-if="text !== undefined" class="modal-heading">{{ text }}</p>
        </div> -->
        <div class="img">
          <img :src="'/assets/img/paypal.jpg'" alt="">
        </div>
        <div class="infor">
          <div class="infor-item">
            <label for="email">Email</label>
            <input type="text" id="email" v-model="email">
          </div>
          <div class="infor-item">
            <label for="amount">Amount</label>
            <input type="text" id="amount" v-model="amount">
          </div>
            
        </div>
        <div class="form-field is-horizontal">
          <!-- <nuxt-link v-if="to !== undefined" class="button is-primary save-button" :to="to">Yes</nuxt-link> -->
          <a v-if="to === undefined" class="button is-primary save-button" @click.prevent="yes">Yes</a>
          <a v-if="to === undefined" class="button is-primary save-button" @click.prevent="$emit('no')">No</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Alert',
    data() {
        return {
            email: '',
            amount: ''
        }
    },
    props: {
        max : {
            type: Number,
            default: 0
        }
    },
    methods: {
        yes() {
            var param = {
                email: this.email,
                amount: this.amount
            }
            this.$emit('yes', param)
        }
    },
//   props: {
//     to: {
//       type: String,
//       required: false,
//       default: undefined,
//     },
//     text: {
//       type: String,
//       required: false,
//       default: undefined,
//     },
//   },
})
</script>
<style lang="scss" scoped>
.img img {
  width: 200px;
}
.infor {
  margin-left: 20px;
}
.infor-item {
  display: flex;
  margin-bottom: 10px;
}
.infor-item label {
  margin-bottom: 0px;
  margin-right: 10px;
}
.infor-item input {
  border: none;
  border-bottom: 1px solid lightgray;
}
.modal-background {
    z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #0004;

  .modal-content {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    width: 400px;
    height: 200px;
    text-align: center;
    background-color: white;
    border: 1px solid black;

    .modal-body {
      width: 100%;

    }
  }

  .form-field.is-horizontal {
    display: flex;
    flex-flow: row;
    justify-content: space-around;

    .button {
      width: 100px;
    }
  }
}
</style>

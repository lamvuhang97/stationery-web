<template>
  <div class="modal-background" @click="$emit('close')">
    <div class="modal-content">
      <div class="modal-body" @click.stop>
        <!-- <div class="modal-header">
          <p v-if="text !== undefined" class="modal-heading">{{ text }}</p>
        </div> -->
        <div class="img">
          <img :src="'/assets/img/paypal.jpg'" alt="">
        </div>
        <div class="paypal">
            <paypal-checkout
                env="sandbox"
                :amount="amount"
                currency="USD"
                :client="paypal"
                @payment-completed="complete">
            </paypal-checkout>
        </div>
        <div class="form-field is-horizontal">
          <!-- <nuxt-link v-if="to !== undefined" class="button is-primary save-button" :to="to">Yes</nuxt-link> -->
          <a v-if="to === undefined" class="button is-primary save-button" @click.prevent="$emit('close')">Close</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import PaypalCheckout from 'vue-paypal-checkout'
export default Vue.extend({
  name: 'Alert',
  components: {
        PaypalCheckout
    },
    data() {
        return {
            paypal: {
                sandbox: "AZhIu0RkhaIzYZoeEo9WRDb77RwIAdKJ2xU-asSooHjntci8urKtzXyE_XxcZDUfT3bgnubNGgAOpAlb",
                production: ""
            }
        }
    },
    methods: {
        complete() {
            this.$emit('complete')
        }
    },
    props: {
        amount: {
            type: Number,
            required: true
        }
    }
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
    height: auto;
    text-align: center;
    background-color: white;
    border: 1px solid black;

    .modal-body {
      width: 100%;

      .modal-header {
        margin-top: 50px;
        margin-right: 10px;
        margin-left: 10px;
      }
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

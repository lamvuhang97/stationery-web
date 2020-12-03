<template>
    <div class="paypal">
        <paypal-checkout
            env="sandbox"
            amount="1"
            currency="USD"
            :client="paypal"
            @payment-completed="complete">
        </paypal-checkout>
    </div>
</template>
<script>
import PaypalCheckout from 'vue-paypal-checkout'
export default {
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
            console.log("success");
        }
    }
}
</script>
<style scoped>
.paypal {
    padding-top: 100px;
}
</style>
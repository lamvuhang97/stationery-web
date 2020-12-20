import axios from "axios";
// import Vue from "vue";

export const paypal = {
  async payout(payload) {
    return await axios.post(
      "https://5ca4ea352323.ngrok.io/webhook/paypal/payout",
      payload
    );
  },
  };
  
import axios from "axios";
import Vue from "vue";
import { settings } from "@/library/variables";

export const transactions = {
  async getSubTransactions(id) {
    return await axios.get(
      Vue.prototype.$settings.baseURL + "/properties/" + settings.propertyID + "/subscribers/"+ id + "/transactions"
    );
  }
}
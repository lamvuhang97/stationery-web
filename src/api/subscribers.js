import axios from "axios";
import api from ".";
import { settings } from "@/library/variables";

export const subscribers = {
  async get(id) {
    if (id) {
      return await axios.get(
        settings.baseURL + "/properties/" + settings.propertyID + "/subscribers/" + id + "?include=entitlements"
      );
    } else {
      return await axios.get(
        settings.baseURL + "/properties/" + settings.propertyID + "/subscribers",
        null
      );
    }
  },

  async update(id, payload) {
    return await axios
      .patch(settings.baseURL + "/properties/" + settings.propertyID + "/subscribers/" + id, payload)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
  async delete(id) {
    return await axios
      .delete(settings.baseURL + "/properties/" + settings.propertyID + "/subscribers/" + id, null)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  },
  async create(payload) {
    return await axios
      .post(settings.baseURL + "/properties/" + settings.propertyID + "/subscribers", payload)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  }
};

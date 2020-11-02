import api from ".";
import { settings } from "@/library/variables";
import axios from 'axios';

export const authentications = {
  // async login(data) {
  //   try {
  //     return await axios.post(
  //       `/login`,
  //       {},
  //       {
  //         headers: {
  //           Authorization:
  //             'Basic ' +
  //             Buffer.from(data.Email + ':' + data.Password).toString('base64')
  //         }
  //       }
  //     )
  //   } catch (err) {
  //     return api.response.error(err)
  //   }
  // },
  async login(payload) {
    try {
      return await axios.post("/auth/admin/login",payload)
    } catch (err) {
      return api.response.error(err)
    }
  },
  // async register(payload) {
  //   return await axios
  //     .post("/register", payload)
  //     .catch(error => {
  //       return api.response.error(error.response.data);
  //     })
  // },
  async forgotPassword(payload) {
    return await axios
      .post("/forgot-password", payload)
      .catch(error => {
        return api.response.error(error.response.data);
      })
  },
  async resetPassword(id) {
    return await axios
      .post(settings.baseURL + "/properties/" + settings.propertyID + "/subscribers/" + id + '/reset-password', null)
      .catch(error => {
        return api.response.error(error.response.data);
      });
  }
};

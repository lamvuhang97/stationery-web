import axios from "axios";

export const reviews = {
  async getReviewByProduct(productId) {
    return await axios.get("reviews/product/" + productId)
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("not found", error);
        return
    });
  },

  async postReview(payload) {
    return await axios.post("reviews", payload)
      .catch(error => {
        // return api.response.error(error.response.data);
        console.log("not found", error);
        return
    });
  }
    
};
  
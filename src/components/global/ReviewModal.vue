<template>
  <div class="modal-background" @click="$emit('no')">
    <div class="modal-content">
      <div class="modal-body" @click.stop>
        <div class="modal-header">
          <p class="modal-heading">
            Bạn hài lòng với sản phẩm chứ?
          </p>
        </div>
        <br />
        <div class="body">
            <div class="rate">
                <star-rating v-model="dataReview.point"></star-rating>
            </div>
            <div class="content">
                <label for="" style="padding-right:10px">Đánh giá: </label>
                <input type="text" v-model="dataReview.content">
            </div>
        </div>
        <div class="form-field is-horizontal">
          <a v-if="to === undefined" class="button is-primary save-button" @click.prevent="$emit('yes', dataReview )">Yes</a>
          <a class="button is-primary save-button" @click.stop="$emit('no')">No</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {StarRating} from 'vue-rate-it';
export default Vue.extend({
  name: 'AreYouSure',
  components:{
    StarRating
  },
  data() {
      return {
          dataReview: {
              point: null,
              content: ""
          }
      }
  }
})
</script>
<style lang="scss" >
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
    width: auto;
    height: auto;
    text-align: center;
    background-color: white;
    border: 1px solid black;

    .modal-body {
      width: 100%;

      .modal-header {
        margin: 0px;
      }

      .body {
        .rate {
          margin-bottom: 20px;
        }


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

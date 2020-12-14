<template>
  <div class="modal-background" @click="$emit('no')">
    <div class="modal-content">
      <div class="modal-body" @click.stop>
        <div class="modal-header">
          <p class="modal-heading">
            Thêm địa chỉ nhận hàng mới
          </p>
          <div class="input-address">
                <div class="phone">
                    <label for="phone">Số điện thoại</label>
                    <input type="text" id="phone" v-model="address.phonenumber">
                </div>
                <div class="address">
                    Tỉnh/Thành phố: <select name="province" id="province" v-model="address.province">
                            <option v-for="item in provinceList" :key="item" :value="item.id">{{item.name}}</option>
                        </select>
                    Quận/Huyện: <select name="district" id="district" v-model="address.district">
                            <option v-for="item in districtList" :key="item" :value="item.id">{{item.name}}</option>
                        </select>
                </div>
                <div class="detail">
                    <label for="detail">Địa chỉ:</label>
                    <input type="text" id="detail" v-model="address.detail">
                </div>
          </div>
        </div>
        <br />
        <div class="form-field is-horizontal">
          <a v-if="to === undefined" class="button is-primary save-button" @click.prevent="$emit('yes', address)">Yes</a>
          <a class="button is-primary save-button" @click.stop="$emit('no')">No</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'AreYouSure',
  props: {
    to: {
      type: String,
      required: false,
      default: undefined,
    },
    text: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      address: {},
      provinceList: [],
      districtList: []
    }
  },
  watch: {
    async "address.province"() {
      await this.$api.address.getDistrictByProvince(this.address.province).then(res => {
        this.districtList = res.data.data
      })
    }
  },
  async mounted() {
      await this.$api.address.getProvince().then(res => {
        this.provinceList = res.data.data
      })

      
  }
})
</script>
<style lang="scss" scoped>
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
    width: 600px;
    height:300px;
    text-align: center;
    background-color: white;
    border: 1px solid black;

    .modal-body {
      width: 100%;

      .modal-header {
        display: flex;
        flex-direction: column;
        align-items: center;

        .input-address {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          div {
            padding: 5px 0;
          }

          input {
            border: none;
            border-bottom: 1px solid gray;
          }
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

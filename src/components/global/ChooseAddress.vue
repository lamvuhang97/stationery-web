<template>
  <div class="modal-background" @click="$emit('no')">
    <div class="modal-content">
      <div class="modal-body" @click.stop>
        <div class="modal-header">
          <p class="modal-heading">
            Chon dia chi giao hang
          </p>
          <div class="infor-address" v-for="item in address" :key="item" >
              <input type="radio" name="address" :value="item.id" @change="selectAddress">
              <div>
                    <span>So dien thoai: {{item.phonenumber}}</span>
                    <span>Dia chi: {{item.detail}}, {{item.district.name}}, {{item.province.name}}</span>
              </div>
                
          </div>
        </div>
        <br />
        <div class="form-field is-horizontal">
          <a v-if="to === undefined" class="button is-primary save-button" @click.prevent="$emit('yes', selected)">Yes</a>
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
      address: [],
      selected: 0
    }
  },
  methods: {
      selectAddress(e) {
          console.log(e.target.value);
          this.selected = e.target.value
      }
  },
  async mounted() {
      await this.$api.address.getMyAddress().then(res => {
        this.address = res.data.data
        console.log(this.address);
        
      })

      
  }
})
</script>
<style lang="scss">
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
    height: auto;
    text-align: center;
    background-color: white;
    border: 1px solid black;

    .modal-body {
      width: 100%;

      .modal-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      
      .infor-address{
        display: flex;
        align-items: center;
        padding: 10px;
        width: 100%;

        input {
          margin: 0px 10px 0 0;
        }

        div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border: 1px solid gray;
          padding: 10px;
          width: 80%;
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
}
</style>

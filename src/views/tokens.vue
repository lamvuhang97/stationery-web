<template>
  <div>
    <div class="form-group top-control-container">
      <button class="btn btn-primary" @click="createToken">Create New Token</button>
    </div>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>
const momentTz = require('moment-timezone')

export default {
  name: "Tokens",
  data() {
    return {
      props: {
        columns: [
          {
            label: "Description",
            field: "attributes.description",
            filterable: true,
            sortable: false,
            type: 'string'
          },
          {
            label: "Token",
            field: "attributes.token",
            filterable: false,
            sortable: false
          },
          {
            label: "Created",
            field: "attributes.created_at",
            filterable: false,
            sortable: false,
            formatFn : this.formatTime
          },
          {
            label: "Last Used",
            field: "attributes.last_used_at",
            filterable: false,
            sortable: false,
            formatFn : this.formatTime
          },
          {
            label: "Revoked",
            field: "attributes.revoked_at",
            filterable: false,
            sortable: false,
            formatFn : this.formatTime
          },
        ],
        norowsfound: "token",
        searchname: "Search",
        remoteURL: this.$settings.baseURL + "/access-tokens",
        isLoading: false,
      },
      reload: false,     
    };
  },
  methods: {
    formatTime(value) {
        return momentTz(value).format('M-D-YYYY h:mm a')
    },
    name(rowObj) {
      return rowObj.attributes.first_name +" " +rowObj.attributes.last_name
    },
    async cellClick() {},
    createToken() {
      this.$router.push({ name: "TokensCRUD" });
    }
  }
};
</script>
<style>
.top-control-container {
  display: flex;
  justify-content: space-between;
  margin: 0 20px 16px;
}
.input-checkbox-container {
  align-items: center;
  background-color: #eaecf4;
  border: 1px solid #d1d3e2;
}
.checkbox-large:focus {
  outline: unset;
}
.top-right-control-container {
  float: right;
  width: unset !important;
}
.top-right-control-container .form-control {
  width: unset !important;
}
.checkbox-large {
  transform: scale(2);
  -ms-transform: scale(2);
  -webkit-transform: scale(2);
  padding: 10px;
}
.form-group-label {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #6e707e;
  text-align: center;
  white-space: nowrap;
  margin: 0 10px 0 30px;
}
</style>

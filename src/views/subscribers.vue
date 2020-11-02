<template>
  <div>
    <div class="form-group top-control-container">
      <button class="btn btn-primary" @click="createSubscriber">Create New Subscriber</button>
    </div>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>
export default {
  name: "Promos",
  data() {
    return {
      props: {
        columns: [
          {
            label: "Email",
            field: "attributes.email",
            filterable: true,
            sortable: false,
            type: 'string'
          },
          {
            label: "Name",
            field: this.name,
            filterable: false,
            sortable: false
          },
          {
            label: "Entitlement",
            field: "entitlement",
            filterable: false,
            sortable: false
          },
          {
            label: "",
            field: "removebutton",
            sortable: false,
            page: "subscriber"
          }
        ],
        norowsfound: "subscriber",
        searchname: "Search for a subscriber by email...",
        remoteURL: this.$settings.baseURL + "/properties/" + this.$settings.propertyID + "/subscribers",
        isLoading: false,
        searchParams: 'email'
      },
      reload: false,
    };
  },
  methods: {
    name(rowObj) {
      return rowObj.attributes.first_name +" " +rowObj.attributes.last_name
    },
    async cellClick(params) {
      if (params.column.field == "removebutton") {
        var response = await this.$api.subscribers.delete(params.row.id);
        if (response.status == 204) {
          this.$toasted.success("Subscriber Deleted");
          this.reload = !this.reload;
        } else {
          this.$toasted.error(response.message);
        }
      } else {
        this.$router.push({ name: "SubscribersUpdate", params: params.row });
      }
    },
    createSubscriber() {
      this.$router.push({ name: "SubscribersCreate" });
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

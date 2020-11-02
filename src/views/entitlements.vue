<template>
  <div>
    <div class="form-group top-control-container">
      <button class="btn btn-primary" @click="createEntitlement">Create New Entitlement</button>
    </div>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>
export default {
  name: "Entitlements",
  data() {
    return {
      props: {
        columns: [
          {
            label: "Title",
            field: "attributes.title",
            filterable: true,
            sortable: false,
          },
          {
            label: "Description",
            field: "attributes.description",
            filterable: true,
            sortable: false,
          },
          {
            label: "",
            field: "removebutton",
            sortable: false,
            page: "document"
          }
        ],
        norowsfound: "entitlement",
        searchname: "Search for a entitlement by title...",
        remoteURL: this.$settings.baseURL + "/properties/" + this.$settings.propertyID + "/entitlements",
        isLoading: false,
        searchParams: 'title'
      },
      reload: false,
    };
  },
  methods: {
    async cellClick(params) {
      if (params.column.field == "removebutton") {
        var response = await this.$api.entitlements.delete(params.row.id);
        if (response.status == 200) {
          this.$toasted.success("Entitlement Deleted");
          this.reload = !this.reload;
        } else {
          this.$toasted.error(response.message);
        }
      } else {
        this.$router.push({ name: "EntitlementsUpdate", params: params.row });
      }
    },
    createEntitlement() { 
      this.$router.push({ name: "EntitlementsCreate" });
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

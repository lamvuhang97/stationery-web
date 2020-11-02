<template>
  <div>
    <div class="form-group top-control-container">
      <button class="btn btn-primary" @click="createCollection">Create New Collection</button>
    </div>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>
export default {
  name: "Collections",
  data() {
    return {
      props: {
        columns: [
          {
            label: "",
            field: "image",
            width: "100px",
            filterable: true,
            sortable: false,
          },
          {
            label: "Title",
            field: "attributes.title",
            filterable: true,
            sortable: false,
          },
          {
            label: "Description",
            field: "attributes.description",
            width: "60%",
            filterable: false,
            sortable: false
          },
          {
            label: "",
            field: "removebutton",
            sortable: false,
            page: "collection"
          }
        ],
        norowsfound: "collection",
        searchname: "Search for a collection by title...",
        remoteURL: this.$settings.baseURL + "/properties/" + this.$settings.propertyID + "/collections",
        isLoading: false,
        searchParams: 'title'
      },
      reload: false, 
    };
  },
  methods: {
    async cellClick(params) {
      if (params.column.field == "removebutton") {
        var response = await this.$api.collections.delete(params.row.id);
        if (response.status == 204) {
          this.$toasted.success("Collection Deleted");
          this.reload = !this.reload;
        } else {
          this.$toasted.error(response.message);
        }
      } else {
        this.$router.push({ name: "CollectionsUpdate", params: params.row });
      }
    },
    createCollection() { // change to detail subscriber
      this.$router.push({ name: "CollectionsCreate" });
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

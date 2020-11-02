<template>
  <div>
    <div class="form-group">
      <button class="btn btn-primary" @click="createUser">
        Create New Product
      </button>
    </div>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>

export default {
  name: "Users",
  data() {
    return {
      props: {
        norowsfound: "product",
        searchname: "Search for a product by name...",
        columns: [
          {
            label: "Name",
            field: "name",
            type: 'string',
            filterable: true
          },
          {
            label: "Category",
            field: "category.name",
            type: 'string',
            filterable: true
          },
          {
            label: "Price",
            field: "price",
            type: 'string',
            filterable: true
          },
          {
            label: "Quantity",
            field: "quantity",
            type: 'string',
            filterable: true
          },
          {
            label: "Status",
            field: this.status,
            type: 'string',
            filterable: true
          },
          {
            label: "",
            field: "removebutton",
            sortable: false,
            page: "user"
          }
        ],
        remoteURL: this.$settings.baseURL + "/products",
        isLoading: false,
        searchParams: "name",
      },
      reload: false,
      filter: "name"
    };
  },
  methods: {
    status(rowObj) {
      if(rowObj.status === true){
        return "Enable"
      }
      if(rowObj.status === false){
        return "Disable"
      }
    },
    async cellClick(params) {
      if (params.column.field == "removebutton") {
        var response = await this.$api.users.delete(params.row.id);
        if (response.status < 300) {
          this.$toasted.success("Deleted User");
          this.reload = !this.reload;
        } else {
          this.$toasted.error(response.message);
        }
      } else {
        this.$router.push({ name: "UsersUpdate", params: params.row });
      }
    },
    createUser() {
      this.$router.push({ name: "UserCreate" });
    }
  },
};
</script>

<template>
  <div>
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
            field: "editbutton",
            sortable: false,
            page: "user"
          }
        ],
        remoteURL: this.$settings.baseURL + "/products/my-product",
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
      if (params.column.field == "editbutton") {
        this.$router.push({ name: "ProductCRUD", params: params.row });
      } else {
        this.$router.push({ name: "ProductDetail", params: params.row });
      }
    }
  },
};
</script>

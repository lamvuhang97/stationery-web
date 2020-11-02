<template>
  <div>
    <div class="form-group">
      <button class="btn btn-primary" @click="createUser">
        Create New Category
      </button>
    </div>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>

export default {
  name: "Category",
  data() {
    return {
      props: {
        norowsfound: "category",
        searchname: "Search for a category by name...",
        columns: [
          {
            label: "Name",
            field: "name",
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
        remoteURL: this.$settings.baseURL + "/categories",
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

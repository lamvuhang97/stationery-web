<template>
  <div>
    <div class="form-group">
      <button class="btn btn-primary" @click="createUser">
        Create New User
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
        norowsfound: "user",
        searchname: "Search for a user by username...",
        columns: [
          {
            label: "Username",
            field: "username",
            type: 'string',
            filterable: true,
          },
          {
            label: "Email",
            field: "email",
            type: 'string',
            filterable: true
          },
          {
            label: "Phone Number",
            field: "phonenumber",
            type: 'string',
            filterable: true
          },
          {
            label: "Address",
            field: "address",
            type: 'string',
            filterable: true,
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
        remoteURL: this.$settings.baseURL + "/users",
        isLoading: false,
        searchParams: "username",
      },
      reload: false,
      filter: "username"
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
      this.$router.push({ name: "UsersCreate" });
    }
  },
};
</script>

<template>
    <div>
        <custom-table :props="props" @cell-click="cellClick" :reload="reload" v-if="fetched"></custom-table>
  </div>
</template>
<script>
export default {
    data() {
        return {
            fetched: false,
            props: {
                norowsfound: "product",
                searchname: "Search for a product by name...",
                columns: [
                {
                    label: "Ma don hang",
                    field: "id",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Nguoi ban",
                    field: "user.username",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Tong tien",
                    field: "price",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Trang thai",
                    field: "status.name",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Ngay dat hang",
                    field: "createdAt",
                    type: 'string',
                    filterable: true
                },
                ],
                data: null,
                // remoteURL: this.$settings.baseURL + "/orders/my-order",
                isLoading: false,
                searchParams: "id",
            },
            reload: false,
            filter: "id"
        };
    },
    computed: {
        status() {
            return this.$route.params.status;
        }
    },
    watch: {
        "status"() {
            this.fetchData(this.$route.params.status)
        },
        "props.data"() {
            this.reload = !this.reload
        }
    },
    methods: {
        statuses(rowObj) {
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
            this.$router.push({ name: "ProductDetail", params: params.row });
        }
        },
        async fetchData(status) {
          await this.$axios.get(this.$settings.baseURL + "/orders/my-order/" + status).then(response => {
          this.props.data = response.data.data.rows;
          this.fetched = true
        });
        }
    },
    
   async mounted() {
       console.log("mount");
       await this.$axios.get(this.$settings.baseURL + "/orders/my-order/" + this.$route.params.status).then(response => {
          this.props.data = response.data.data.rows;
          this.fetched = true
        });
    }
}
</script>
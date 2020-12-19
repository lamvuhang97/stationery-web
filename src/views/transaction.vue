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
            orderList: [],
            props: {
                norowsfound: "order",
                searchname: "Search for a product by name...",
                columns: [
                {
                    label: "Mã đơn hàng",
                    field: "id",
                    type: 'string',
                    filterable: true
                },
                {
                    label: this.type === "my-transaction" ? "Người bán" : "Người mua",  // => not done yet
                    field: this.userField,
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Tổng tiền",
                    field: "total",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Trạng thái",
                    field: "status.name",
                    type: 'string',
                    filterable: true
                },
                {
                    label: "Ngày đặt hàng",
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
        },
        type() {
            if(this.$route.fullPath.includes("account")) {
                return 'my-transaction'
            } else {
                return 'my-order'
            }
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
        // date(rowObj) {
        //     return rowObj.createdAt.replace("T", " ").replace(".000Z", "")
        // },
        userLabel(rowObj) {
            console.log(rowObj);
            return this.type === 'my-transaction' ? "Nguoi ban" : "Nguoi mua"
        },
        userField(rowObj) {
            return this.type === 'my-transaction' ? rowObj.owner.username : rowObj.user.username
        },
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
            this.$router.push({ name: "OrderDetail", params: {data: params.row, type: this.type }});
        }
        },
        async fetchData(status) {
            // if(this.$route.fullPath.includes("transaction")) {
            //     this.type = 'my-transaction'
            // } else {
            //     this.type ='my-order'
            // }
            await this.$axios.get(this.$settings.baseURL + "/orders/" + this.type + "/" + status).then(response => {
            response.data.data.rows.forEach(item => {
                for ( var i in item ) {
                    if(i == "createdAt") {
                        item[i] = item[i].replace("T", " ").replace(".000Z", "")
                    }
                }
            })
            this.props.data = response.data.data.rows;
            this.fetched = true
        });
        }
    },
    
   async mounted() {
       console.log("mount");
    //    if(this.$route.fullPath.includes("transaction")) {
    //        this.type = 'my-transaction'
    //    } else {
    //        this.type ='my-order'
    //    }
       await this.$axios.get(this.$settings.baseURL + "/orders/" + this.type + "/" + this.$route.params.status).then(response => {
          this.props.data = response.data.data.rows;
          this.fetched = true
        });
    }
}
</script>
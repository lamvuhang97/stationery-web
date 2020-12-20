<template>
    <div class="container">
        <h3>Bạn có <span style="color: red">{{dataOrder.choxacnhan}}</span> đơn hàng đang chờ xác nhận</h3>
        <div class="analyze">
            <div class="analyze-order analyze-item">
                <h4>Thống kê đơn hàng</h4>
                <h5>Tổng số đơn hàng: <span style="color:red">{{sumOrder}}</span></h5>
                <div class="items" style="display:flex; flex-direction:column">
                    <div class="items" style="margin-bottom: 10px">
                        <div class="item" style="border-right:1px solid gray">
                            <span class="number">{{dataOrder.cholayhang}}</span>
                            <span class="title">Chờ lấy hàng</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray">
                            <span class="number">{{dataOrder.danggiao}}</span>
                            <span class="title">Đang giao</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray">
                            <span class="number">{{dataOrder.dagiao}}</span>
                            <span class="title">Đã giao</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray;background-color: chartreuse;">
                            <span class="number">{{dataOrder.hoanthanh}}</span>
                            <span class="title">Hoàn thành</span>
                        </div>
                    </div>
                    <div class="items">
                        <div class="item" style="border-right:1px solid gray; background-color:coral">
                            <span class="number">{{dataOrder.choxuly}}</span>
                            <span class="title">Chờ xử lý</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray">
                            <span class="number">{{dataOrder.dangtrahang}}</span>
                            <span class="title">Đang trả hàng</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray">
                            <span class="number">{{dataOrder.datrahang}}</span>
                            <span class="title">Đã trả hàng</span>
                        </div>
                        <div class="item" style="border-right:1px solid gray; background-color: #e0705e">
                            <span class="number">{{dataOrder.dahuy}}</span>
                            <span class="title">Đã hủy</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="analyze-product analyze-item">
                <h4>Thống kê sản phẩm</h4>
                <button class="btn btn-primary" style="float:right" @click="exportProduct">Xuất file excel</button>
                <h5>Tổng số sản phẩm: <span style="color:red">{{sumProduct}}</span></h5>
                
                <div class="items">
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataProduct.active}}</span>
                        <span class="title">Đang bán</span>
                    </div>
                    <div class="item" style="border-right:1px solid gray; background-color: coral">
                        <span class="number">{{dataProduct.sold}}</span>
                        <span class="title">Hết hàng</span>
                    </div>
                    <div class="item" style="border-right:1px solid gray; background-color: dimgrey; color: white ">
                        <span class="number">{{dataProduct.locked}}</span>
                        <span class="title">Tạm khóa</span>
                    </div>
                </div>
            </div>
            <div class="analyze-sale analyze-item">
                <h4>Thống kê doanh thu</h4>
                <h5>Tổng doanh thu: <span style="color:red">{{dataSale.sum}} $</span></h5>
                <div class="items">
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataSale.day}}</span>
                        <span class="title">Trong ngày</span>
                    </div>
                    <div class="item" style="border-right:1px solid gray">
                        <span class="number">{{dataSale.week}}</span>
                        <span class="title">Trong tuần </span>
                    </div>
                    <div class="item">
                        <span class="number">{{dataSale.month}}</span>
                        <span class="title">Trong tháng </span>
                    </div>
                </div>
            </div>
        </div>
         <chart v-if="fetched"
            :chart-data="dataChart"
            :options="options"
        />
    </div>
</template>
<script>
import Chart from "../components/chart.js"
import Vue from "vue"
export default {
    components: {
        Chart
    },
    data() {
        return {
            fetched: false,
            dataChart: {
                labels: [],
                datasets: [{
                    data: [],
                    label: "Doanh thu ($)",
                    borderColor: '#3e95cd'
                }]
            },
            options: {
                title: {
                display: true,
                text: 'Doanh thu trong tháng'
                },
                responsive: true,
                maintainAspectRatio: false
            },
            dataOrder:  {
                choxacnhan: 0,
                cholayhang: 0,
                danggiao: 0,
                dagiao: 0,
                dahuy: 0,
                choxuly: 0,
                dangtrahang: 0,
                datrahang: 0,
                hoanthanh: 0
            },
            dataProduct: {
                active:0,
                locked:0,
                sold: 0
            },
            dataSale: {
                day: 0,
                week: 0,
                month: 0,
                sum: 0
            }
        }
    },
    computed: {
        sumOrder() {
            var sum = 0
            for( var i in this.dataOrder) {
                sum += this.dataOrder[i]
            }
            return sum
        },
        sumProduct() {
            return this.dataProduct.active + this.dataProduct.locked + this.dataProduct.sold
        },
    },
    methods: {
        async exportProduct() {
            // await this.$api.exportexcel.exportProduct()
            // .then(res => {
            //     console.log(res);
            // })
            var userId= Vue.prototype.$localstorage.getUserID()
             window.open("http://localhost:3000/exportexcel/product/" + userId, "_blank"); 
        }
    },
    async mounted(){
        await this.$api.orders.getOrderAnalyze()
        .then(res => {
            console.log(res);
            res.data.data.forEach((item) => {
                var status = item.statusId
                switch(status) {
                    case 1:
                        this.dataOrder.choxacnhan = item.number
                        break
                    case 2:
                        this.dataOrder.cholayhang = item.number
                        break
                    case 3:
                        this.dataOrder.danggiao = item.number
                        break
                    case 4:
                        this.dataOrder.dagiao = item.number
                        break
                    case 5:
                        this.dataOrder.dahuy = item.number
                        break
                    case 6:
                        this.dataOrder.choxuly = item.number
                        break
                    case 7:
                        this.dataOrder.dangtrahang = item.number
                        break
                    case 8:
                        this.dataOrder.datrahang = item.number
                        break
                    case 9:
                        this.dataOrder.hoanthanh = item.number
                        break 
                }
            })
            console.log(this.dataOrder);
        })

        await this.$api.products.getProductAnalyze()
        .then(res => {
            res.data.data.forEach((item) => {
                var status = item.status
                switch(status) {
                    case true:
                        this.dataProduct.active = item.number
                        break
                    case false:
                        this.dataProduct.locked = item.number
                        break
                }
            })
            
            this.dataProduct.sold = res.data.sold
            this.dataProduct.active -= this.dataProduct.sold
        })

        await this.$api.orders.getSaleAnalyze()
        .then(res => {
            if(res.data.data.day.length > 0) {
                res.data.data.day.forEach(item => {
                    this.dataSale.day += Number(item.total)
                })
            }
            if(res.data.data.week.length > 0) {
                res.data.data.week.forEach(item => {
                    this.dataSale.week += Number(item.total)
                })
            }
            if(res.data.data.month.length > 0) {
                res.data.data.month.forEach(item => {
                    this.dataSale.month += Number(item.total)
                })
            }
            if(res.data.data.sum.length > 0) {
                res.data.data.sum.forEach(item => {
                    this.dataSale.sum += Number(item.total)
                })
            }
        })

        // vue chart
        var timeArrStr =[]
        // var now = new Date()
        for( var i =0; i <30; i++){
            var timeCur = new Date(new Date() - i*24 * 60 * 60 * 1000)
            var timeCurStr = timeCur.toString().substring(4,10)
            switch(timeCurStr.substring(0,3)){
                case "Jan":
                    timeCurStr = timeCurStr.replace("Jan ", "01-")
                    break
                case "Feb":
                    timeCurStr = timeCurStr.replace("Feb ", "02-")
                    break
                case "Mar":
                    timeCurStr = timeCurStr.replace("Mar ", "03-")
                    break
                case "Apr":
                    timeCurStr = timeCurStr.replace("Apr ", "04-")
                    break
                case "May":
                    timeCurStr = timeCurStr.replace("May ", "05-")
                    break
                case "Jun":
                    timeCurStr = timeCurStr.replace("Jun ", "06-")
                    break
                case "Jul":
                    timeCurStr = timeCurStr.replace("Jul ", "07-")
                    break
                case "Aug":
                    timeCurStr = timeCurStr.replace("Aug ", "08-")
                    break
                case "Sep":
                    timeCurStr = timeCurStr.replace("Sep ", "09-")
                    break
                case "Oct":
                    timeCurStr = timeCurStr.replace("Oct ", "10-")
                    break
                case "Nov":
                    timeCurStr = timeCurStr.replace("Nov ", "11-")
                    break
                case "Dec":
                    timeCurStr = timeCurStr.replace("Dec ", "12-")
                    break
            }
            timeArrStr.push(timeCurStr)
        }
        this.dataChart.labels = timeArrStr
        console.log("dfsdf", timeArrStr);

        await this.$api.orders.getSaleAnalyzeDayInWeek()
        .then(res => {
            console.log("test analyze", res);
            timeArrStr.forEach((day,ind) => {
                this.dataChart.datasets[0].data.push(0)
                res.data.data.forEach(sale => {
                    if(day == sale.createdOn.substring(5,10)){
                        this.dataChart.datasets[0].data[ind] = Number(sale.total)
                        // this.dataChart.datasets[0].data.push(Number(sale.total))
                    } 
                })
            })
            this.fetched = true
        })
        console.log(this.dataChart);
        
    }
}
</script>
<style scoped>
.items {
    display: flex;
    justify-content: center;
}
.item {
    display: flex;
    flex-direction: column;
    align-items: center;
     margin: 0px 20px;
    width: 25%;
    height: 70px;
    border-radius: 10px;
    background-color:#bdace4;
    justify-content: space-evenly;
}
.analyze-item {
    padding-top: 20px;
}
</style>
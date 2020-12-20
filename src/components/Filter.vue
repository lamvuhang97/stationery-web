<template>
    <div class="filter">
        <div class="sort">
            <h5><label for="cars">Sắp xếp theo:</label></h5>
            <select name="cars" id="cars" @change="sortFunc">
                <option value="sell">Bán chạy</option>
                <option value="new">Mới nhất</option>
                <option value="up">Giá tăng dần</option>
                <option value="down">Giá giảm dần</option>
            </select>
        </div>
        <h5>Khoảng giá</h5>
        <div class="price">
            <div class="price-item">
                <input type="radio" id="price" name="price" checked value="0" @change="priceFunc">
                <label for="price"> Tất cả giá </label>
            </div>
            <div class="price-item">
                <input type="radio" id="price" name="price" value="1" @change="priceFunc">
                <label for="price"> Ít hơn 10$ </label>
            </div>
            <div class="price-item">
                <input type="radio" id="price" name="price" value="2" @change="priceFunc">
                <label for="price"> 10$ - 50$ </label>
            </div>
            <div class="price-item">
                <input type="radio" id="price" name="price" value="3" @change="priceFunc">
                <label for="price"> 50$ - 100$ </label>
            </div>
            <div class="price-item">
                <input type="radio" id="price" name="price" value="4" @change="priceFunc">
                <label for="price"> Nhiều hơn 100$ </label>
            </div>
        </div>
        <button class="btn btn-primary" @click="filter">Loc</button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            sort: 'sell',
            price: '0'
        }
    }, 
    computed: {
        filterString() {
            return "&sort=" + this.sort + "&price=" + this.price
        }
    },
    methods: {
        filter() {
            this.$emit('filter', this.filterString)
        },
        sortFunc(e) {
            this.sort = e.target.value
        },
        priceFunc(e) {
            this.price = e.target.value
        }
    }
}
</script>
<style scoped>
    .sort label {
        margin: 0px;
    }
    .sort {
        margin-bottom: 10px;
    }
    .filter {
        border: 1px solid lightgray;
        border-radius: 10px;
        background-color:#E6E0E5;
    width: 200px;
    height: 350px;
    padding: 10px;
    color: black;
    }
    button {
            width: 50%;
    margin: 10px 25%;
    }
</style>
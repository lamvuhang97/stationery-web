<template>
    <div class="filter">
        <div class="sort">
            <label for="cars">Sap xep theo:</label>
            <select name="cars" id="cars" @change="sortFunc">
                <option value="sell">Ban chay</option>
                <option value="new">Moi nhat</option>
                <option value="up">Gia tang dan</option>
                <option value="down">Gia giam dan</option>
            </select>
        </div>
        <h5>Khoang gia</h5>
        <div class="price">
            <div class="price-item">
                <input type="radio" id="price" name="price" checked value="0" @change="priceFunc">
                <label for="price"> Tat ca gia </label>
            </div>
            <div class="price-item">
                <input type="radio" id="price" name="price" value="1" @change="priceFunc">
                <label for="price"> It hon 50 </label>
            </div>
            <div class="price-item">
                <input type="radio" id="price" name="price" value="2" @change="priceFunc">
                <label for="price"> 50 - 100 </label>
            </div>
            <div class="price-item">
                <input type="radio" id="price" name="price" value="3" @change="priceFunc">
                <label for="price"> 100 - 200 </label>
            </div>
            <div class="price-item">
                <input type="radio" id="price" name="price" value="4" @change="priceFunc">
                <label for="price"> Nhieu hon 200 </label>
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
    .filter {
        border: 1px solid black;
    width: 200px;
    height: 300px;
    padding: 10px;
    }
</style>
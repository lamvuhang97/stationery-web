<template>
    <div class="manage-shop">
        <div class="sidebar">
            <ul>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/analyze'" class="navlink">
                    <span>Thống kê</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/orders/transaction/0'" class="navlink">
                    <span>Đơn bán</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/products'" class="navlink">
                    <span>Sản phẩm</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/new-product'" class="navlink">
                    <span>Đăng sản phẩm</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/wallet'" class="navlink">
                    <span>Ví</span>
                </router-link>
                </li>
            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
.manage-shop {
    padding-top: 100px;
}
.sidebar ul{
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
  }
  .sidebar ul li {
    padding: 0 20px;
    color: black;
  }
  a {
    color: black;
    text-decoration: none;
  }
</style>
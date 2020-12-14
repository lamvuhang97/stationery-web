<template>
    <div class="orders">
        <div class="sidebar">
            <ul>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/orders/transaction/0'" class="navlink">
                    <span>Tất cả</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/orders/transaction/1'" class="navlink">
                    <span>Chờ xác nhận</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/orders/transaction/2'" class="navlink">
                    <span>Chờ lấy hàng</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/orders/transaction/3'" class="navlink">
                    <span>Đang vận chuyển</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/orders/transaction/4'" class="navlink">
                    <span>Bị từ chối</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/orders/transaction/5'" class="navlink">
                    <span>Thành công</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/shop/orders/transaction/5'" class="navlink">
                    <span>Thất bại</span>
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
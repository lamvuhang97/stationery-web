<template>
  <nav
    class="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0"
  >
    <div class="container-fluid d-flex p-0">
      <ul class="nav navbar-nav text-light" id="accordionSidebar">
        <li class="nav-item" role="presentation">
          <router-link to="/dashboard" class="nav-link">
            <i class="fas fa-user"></i>
            <span>Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item" role="presentation">
          <router-link to="/users" class="nav-link">
            <i class="fas fa-user"></i>
            <span>Users</span>
          </router-link>
        </li>
        <li class="nav-item" role="presentation">
          <router-link to="/products" class="nav-link">
            <i class="fas fa-pager"></i>
            <span>Products</span>
          </router-link>
        </li>
        <li class="nav-item" role="presentation">
          <router-link to="/category" class="nav-link">
            <i class="fas fa-photo-video"></i>
            <span>Category</span>
          </router-link>
        </li>
        <li class="nav-item" role="presentation">
          <router-link to="/orders" class="nav-link">
            <i class="fas fa-film"></i>
            <span>Orders</span>
          </router-link>
        </li>
      </ul>
      <div class="text-center d-none d-md-inline">
        <button
          class="btn rounded-circle border-0"
          id="sidebarToggle"
          type="button"
        ></button>
      </div>
    </div>
  </nav>
</template>
<script>
// import store from "@/services/storage/store";
export default {
  data() {
    return {
      role: ""
    };
  }
}
</script>

<template>
  <nav
    class="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0"
  >
    <div class="container-fluid d-flex flex-column p-0">
      <a
        class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
        href="#"
      >
        <div class="sidebar-brand-icon rotate-n-15">
          <i class="fas fa-wrench"></i>
        </div>
        <div class="sidebar-brand-text mx-3">
          <span>VMS</span>
        </div>
      </a>
      <hr class="sidebar-divider my-0" />
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
        <li class="nav-item" role="presentation">
          <router-link to="/reviews" class="nav-link">
            <i class="fas fa-file-alt"></i>
            <span>Reviews</span>
          </router-link>
        </li>
        <li class="nav-item" role="presentation">
          <router-link to="/entitlements" class="nav-link">
            <i class="fas fa-building"></i>
            <span>Entitlements</span>
          </router-link>
        </li>
        <li class="nav-item" role="presentation">
          <router-link to="/subscribers" class="nav-link">
            <i class="fas fa-user"></i>
            <span>Subscribers</span>
          </router-link>
        </li>
        <li class="nav-item" role="presentation">
          <router-link to="/tokens" class="nav-link">
            <i class="fas fa-qrcode"></i>
            <span>Tokens</span>
          </router-link>
        </li>
        <li class="nav-item" role="presentation">
          <router-link to="/tags" class="nav-link">
            <i class="fas fa-qrcode"></i>
            <span>Tags</span>
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

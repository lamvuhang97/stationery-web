<template>
  <div class="header">
    <div class="carousel">
      <div id="carouselExampleInterval" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active" data-interval="10000">
            <img src="/assets/img/1.jpeg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item" data-interval="2000">
            <img src="/assets/img/2.jpeg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="/assets/img/3.jpeg" class="d-block w-100" alt="...">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleInterval" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleInterval" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    </div>
    <div class="sidebar">
      <ul>
        <li class="navitem" role="presentation">
          <router-link to="/" class="navlink">
            <span>All Category</span>
          </router-link>
        </li>
        <li class="navitem" role="presentation">
          <router-link to="/home" class="navlink">
            <span>Home</span>
          </router-link>
        </li>
        <li class="navitem" role="presentation">
          <router-link to="/topselling" class="navlink">
            <span>Top Selling</span>
          </router-link>
        </li>
        <li class="navitem" role="presentation">
          <router-link to="/newarrival" class="navlink">
            <span>New Arrival</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
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
<style scoped>
  .text-light ul{
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
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
  }
  a {
    color: black;
  }
  .carousel-item img {
    width: 100%;
    height: 250px;
    object-fit: cover;
  }
  .navitem:focus {
    background-color: red;
  }
</style>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-9 col-lg-12 col-xl-10">
        <div class="card shadow-lg o-hidden border-0 my-5">
          <div class="card-body p-0">
            <div class="row">
              <div class="col-lg-6 d-none d-lg-flex">
                <div
                  class="flex-grow-1 bg-login-image"
                  style="background-image: url('assets/img/logo.jpg');"
                ></div>
              </div>
              <div class="col-lg-6">
                <div class="p-5">
                  <div class="text-center">
                    <h4 class="text-dark mb-4">Stationery Dashboard Login</h4>
                  </div>
                  <div class="text-danger error-message">
                    {{ message }}&nbsp;
                  </div>
                  <div class="form-group">
                    <input
                      class="form-control form-control-user"
                      type="email"
                      id="email"
                      v-model="input.email"
                      aria-describedby="emailHelp"
                      placeholder="Enter Email Address..."
                      name="email"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      class="form-control form-control-user"
                      type="password"
                      v-model="input.password"
                      id="password"
                      placeholder="Password"
                      name="password"
                    />
                  </div>
                  <div class="form-group">
                    <!-- <div class="custom-control custom-checkbox small">
                        <div class="form-check">
                          <input
                            class="form-check-input custom-control-input"
                            type="checkbox"
                            id="formCheck-1"
                          />
                          <label
                            class="form-check-label custom-control-label"
                            for="formCheck-1"
                          >Remember Me</label>
                        </div>
                    </div>-->
                  </div>
                  <button
                    class="btn btn-primary btn-block text-white btn-user"
                    type="submit"
                    @click="handleLogin"
                  >
                    Login
                  </button>
                  <hr />
                  <!-- <div class="text-center">
                    <a class="small" href="/forgot-password"
                      >Forgot Password?</a
                    >
                  </div>
                  <div class="text-center">
                    <a class="small" href="/register">Create an Account!</a>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
export default {
  name: "Login",
  data() {
    return {
      input: {
        email: "",
        password: "",
      },
      message: "",
    };
  },
  methods: {
    handleLogin(e) {
      e.preventDefault();
      if (this.input.email != "" && this.input.password != "") {
        this.$api.authentications
          .login({ username: this.input.email, password: this.input.password })
          .then((response) => {
            if (response.status == 200) {
              Vue.prototype.$localstorage.setToken(response.data);
              Vue.prototype.$localstorage.setName(this.input.email);
              console.log("sdjgf", Vue.prototype.$localstorage.getName());
              if (Vue.prototype.$localstorage.getAccessToken() != null) {
                this.$parent.setAuthenticated(true);
              }
            } else if (response.status >= 300) {
              this.message = response.message;
            }
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      } else {
        this.message = "A username and password must be present";
      }
    },
  }
};
</script>
<style>
.error-message {
  line-height: 1.5;
  text-align: center;
  min-height: 25px;
}
</style>

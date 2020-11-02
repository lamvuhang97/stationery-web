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
                  v-bind:style="
                    'background-image: url(' +
                      baseWebsiteURL +
                      '/assets/img/logo.jpg);'
                  "
                ></div>
              </div>
              <div class="col-lg-6 register-container">
                <div class="p-5 register-inner">
                  <div class="text-center">
                    <h4 class="text-dark mb-4">Reset Password</h4>
                  </div>
                  <div v-if="!mailed">
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
                        disabled
                      />
                    </div>
                    <div class="form-group row">
                      <div class="col-sm-6 mb-3 mb-sm-0">
                        <input
                          class="form-control form-control-user"
                          type="password"
                          v-model="input.password"
                          id="password"
                          placeholder="Password"
                          name="password"
                        />
                      </div>
                      <div class="col-sm-6">
                        <input
                          class="form-control form-control-user"
                          type="password"
                          id="password_repeat"
                          v-model="input.password_repeat"
                          placeholder="Repeat Password"
                          name="password_repeat"
                        />
                      </div>
                    </div>
                    <button
                      class="btn btn-primary btn-block text-white btn-user"
                      type="submit"
                      @click="handleResetPw"
                    >
                      Reset Password
                    </button>
                  </div>
                  <div class="text-center" v-if="mailed">
                    <h5 class="text-success">
                      Successfully reset your password!
                    </h5>
                  </div>
                  <hr />
                  <div class="text-center" v-if="mailed">
                    <a class="small" href="/views">Go to Dashboard</a>
                  </div>
                  <div class="text-center" v-if="!mailed">
                    <a class="small" href="/login">Back to Login</a>
                  </div>
                  <div class="text-center">
                    <a class="small" href="/register">Create an Account!</a>
                  </div>
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
import Vue from "vue";
export default {
  name: "ResetPassword",
  data() {
    return {
      input: {
        email: this.$parent.$route.params.email,
      },
      message: "",
      mailed: false,
      baseWebsiteURL: Vue.prototype.$settings.baseWebsiteURL,
    };
  },
  methods: {
    handleResetPw(e) {
      Vue.prototype.$localstorage.setToken({
        AccessToken: this.$parent.$route.params.token,
      });
      e.preventDefault();
      if (
        this.input.password != "" &&
        this.input.password == this.input.password_repeat
      ) {
        this.$api.authentications
          .resetPassword({ Password: this.input.password })
          .then((response) => {
            if (response.status == 200) {
              this.mailed = true;
              this.message = "";
            } else if (response.status >= 300) {
              this.message = response.message;
            }
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      } else if (this.input.password != this.input.password_repeat) {
        this.message = "Passwords do not match.";
      } else {
        this.message = "Please provide new password.";
      }
    },
  },
};
</script>
<style>
.error-message {
  line-height: 1.5;
  text-align: center;
  min-height: 25px;
}
</style>

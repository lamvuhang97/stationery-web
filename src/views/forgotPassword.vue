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
              <div class="col-lg-6 register-container">
                <div class="p-5 register-inner">
                  <div class="text-center">
                    <h4 class="text-dark mb-4">Forgot Password</h4>
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
                      />
                    </div>
                    <button
                      class="btn btn-primary btn-block text-white btn-user"
                      type="submit"
                      @click="handleForgotPw"
                    >
                      Send
                    </button>
                  </div>
                  <div class="text-center" v-if="mailed">
                    <h5 class="text-success">
                      Successfully send reset password request!
                    </h5>
                    <h5 class="text-success">
                      Please check your email to complete the final step.
                    </h5>
                  </div>
                  <button
                    v-if="mailed"
                    class="btn btn-primary btn-block text-white btn-user"
                    type="submit"
                    @click="handleForgotPw"
                  >
                    Haven't got any email?
                  </button>
                  <hr />
                  <div class="text-center">
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
export default {
  name: "ForgotPassword",
  data() {
    return {
      input: {
        email: "",
      },
      message: "",
      mailed: false,
    };
  },
  methods: {
    handleForgotPw(e) {
      e.preventDefault();
      if (this.input.email != "") {
        this.$api.authentications
          .forgotPassword({ Email: this.input.email })
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
      } else {
        this.message = "Please provide your email.";
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

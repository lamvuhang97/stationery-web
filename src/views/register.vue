<template>
  <div class="container">
    <div class="card shadow-lg o-hidden border-0 my-5">
      <div class="card-body p-0">
        <div class="row">
          <div class="col-lg-5 d-none d-lg-flex" @click="handleHome">
            <div
              class="flex-grow-1 bg-register-image"
              style="background-image: url('assets/img/playlist.png');"
            ></div>
          </div>
          <div class="col-lg-7 register-container">
            <div class="p-5 register-inner">
              <form class="user" v-if="!mailed">
                <div class="text-center">
                  <h4 class="text-dark mb-4">Register Account</h4>
                </div>
                <div class="text-danger error-message">{{ message }}&nbsp;</div>
                <div class="form-group row">
                  <div class="col-sm-12 mb-3 mb-sm-0">
                    <input
                      class="form-control form-control-user"
                      type="text"
                      id="first_name"
                      v-model="input.first_name"
                      placeholder="Username"
                      name="first_name"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-12 mb-3 mb-sm-0">
                    <input
                      class="form-control form-control-user"
                      type="email"
                      id="email"
                      v-model="input.email"
                      aria-describedby="emailHelp"
                      placeholder="Email Address"
                      name="email"
                    />
                  </div>
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
                  @click="handleRegister"
                >
                  Register Account
                </button>
                <hr />
                <hr />
              </form>
              <div class="text-center" v-if="mailed">
                <h5 class="text-success">Successfully create account!</h5>
              </div>
              <!-- <div class="text-center">
                <a class="small" href="/forgot-password">Forgot Password?</a>
              </div> -->
              <div class="text-center">
                <a href="#" @click="handleLogin"
                  >Already have an account? Login!</a
                >
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
  name: "Register",
  data() {
    return {
      input: {
        first_name: "",
        email: "",
        password: "",
        password_repeat: "",
      },
      message: "",
      mailed: false,
    };
  },
  methods: {
    handleRegister(e) {
      e.preventDefault();
      if (
        this.input.email != "" &&
        this.input.password != "" &&
        this.input.first_name != "" &&
        this.input.password == this.input.password_repeat
      ) {
        this.$api.users
          .create({
            username: this.input.first_name,
            email: this.input.email,
            password: this.input.password,
          })
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
        this.message = "Please provide required information";
      }
    },
    handleLogin() {
      this.$parent.login();
    },

    handleHome() {
      this.$parent.home();
    }
  },
};
</script>
<style>
.error-message {
  line-height: 1.5;
  text-align: center;
  min-height: 25px;
}
.register-container {
  min-height: 500px;
  display: flex;
}
.register-inner {
  margin: auto;
}
</style>

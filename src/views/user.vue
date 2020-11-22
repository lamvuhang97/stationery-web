<template>
  <div>
    <div class="information">
        <div class="avatar">
          <div class="img" style="border-radius: 50%">
            <img class="preview" height="268" width="356" :src="imgUrl">
          </div>
        </div>
        <div class="profile">
          <custom-form :formbuilder="formbuilder" @form-save-click="save"></custom-form>
        </div>
    </div>
    <div class="sidebar">
      <ul>
        <li class="navitem" role="presentation">
          <router-link :to="'/user/' + id + '/products'" class="navlink">
            <span>Sản Phẩm</span>
          </router-link>
        </li>
        <li class="navitem" role="presentation">
          <router-link :to="'/user/' + id + '/top-selling'" class="navlink">
            <span>Bán chạy</span>
          </router-link>
        </li>
        <li class="navitem" role="presentation">
          <router-link :to="'/user/' + id + '/new-arrival'" class="navlink">
            <span>Mới nhất</span>
          </router-link>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: "User",
  data() {
    return {
      id: '',
      userData: {},
      imgUrl: "/assets/img/logo.jpg",
      formbuilder: {
        heading: "Thông tin người dùng",
        columns: [
          {
            label: "Tên đăng nhập",
            field: "username",
            value: "",
            filterable: true,
            inputtype: true,
            placeholder: "Username of user"
          },
          {
            label: "Email",
            field: "email",
            value: "",
            filterable: true,
            inputemail: true,
            placeholder: "Email of user"
          },
          {
            label: "Địa chỉ",
            field: "address",
            value: "",
            filterable: true,
            inputtype: true,
            placeholder: "Address of user"
          },
          {
            label: "Số điện thoại",
            field: "phonenumber",
            value: "",
            filterable: true,
            inputtype: true,
            placeholder: "Phonenumber of user"
          },
          {
            label: "Trạng thái",
            field: "status",
            value: "",
            filterable: true,
            inputtype: true,
            placeholder: "Status of user"
            }
        ],
        disabledSave: false,
        hiddenSave : true,
        isLoading: false,
        buttonsavelabel: "Save",
        reloadFormbuilder: true
      },
    }
  },
  async beforeMount() {
    
  },
  methods: {
    test() {
      this.$router.push({name:"UserProducts"})
    }
  },
  async mounted() {
    this.id = this.$route.params.id
    const res = await this.$api.users.get(this.id)
    this.userData = res.data.data
    if(this.userData.avatar != ''){
      this.imgUrl = this.userData.avatar
    }

    if (this.userData) {
      for (var item in this.formbuilder.columns) {
        var field = this.formbuilder.columns[item].field;
        this.formbuilder.columns[item].value = this.userData[field];
        if(field == 'status') {
          if(this.userData[field] == true) {
            this.formbuilder.columns[item].value = 'Hoạt động'
          } else this.formbuilder.columns[item].value = 'Khóa'
        }
      }
    }
  }
}
</script>
<style scoped>
  img {
    border-radius: 50%;
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
  }
  .information {
    padding-top: 100px;
    display: flex;
    justify-content: space-around;
    margin-left: 40px;
    align-items: center;
  }
  .avatar {
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .profile {
    width: 70%;
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

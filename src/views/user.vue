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
    <div class="products">
      <product-section :name="'user'" :id="id" ></product-section>
    </div>
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
        heading: "User Information",
        columns: [
          {
            label: "Username",
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
            label: "Address",
            field: "address",
            value: "",
            filterable: true,
            inputtype: true,
            placeholder: "Address of user"
          },
          {
            label: "Phonenumber",
            field: "phonenumber",
            value: "",
            filterable: true,
            inputtype: true,
            placeholder: "Phonenumber of user"
          },
          {
            label: "Status",
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
  async mounted() {
    this.id = this.$route.params.id
    const res = await this.$api.users.get(this.id)
    console.log(res);
    this.userData = res.data.data
    console.log("sdhf",this.userData);
    if(this.userData.avatar != ''){
      this.imgUrl = this.userData.avatar
    }

    if (this.userData) {
      for (var item in this.formbuilder.columns) {
        var field = this.formbuilder.columns[item].field;
        this.formbuilder.columns[item].value = this.userData[field];
        if(field == 'status') {
          if(this.userData[field] == true) {
            this.formbuilder.columns[item].value = 'Active'
          } else this.formbuilder.columns[item].value = 'Locked'
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
</style>

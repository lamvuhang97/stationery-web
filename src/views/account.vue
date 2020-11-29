<template>
  <div>
    <div class="information">
        <div class="avatar">
          <div class="img" style="border-radius: 50%">
            <img class="preview" height="268" width="356" :src="imgUrl">
          </div>
          <div class="update-img">
            <button class="btn btn-primary" @click="click1">Chọn ảnh</button>
            <!-- <button class="btn btn-success" @click="create">Upload</button> -->
            <input type="file" ref="input1"
              style="display: none"
              @change="previewImage" accept="image/*" >
          </div>
        </div>
        <div class="profile">
          <custom-form :formbuilder="formbuilder" @form-save-click="save"></custom-form>
        </div>
    </div>
    <h2 style="padding-left: 80px">Đơn mua</h2>
    <div class="transaction">
      <div class="sidebar">
            <ul>
                <li class="navitem" role="presentation">
                <router-link :to="'/account/transaction/0'" class="navlink">
                    <span>Tất cả</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/account/transaction/1'" class="navlink">
                    <span>Chờ xác nhận</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/account/transaction/2'" class="navlink">
                    <span>Đang vận chuyển</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/account/transaction/3'" class="navlink">
                    <span>Bị từ chối</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/account/transaction/4'" class="navlink">
                    <span>Thành công</span>
                </router-link>
                </li>
                <li class="navitem" role="presentation">
                <router-link :to="'/account/transaction/5'" class="navlink">
                    <span>Thất bại</span>
                </router-link>
                </li>
            </ul>
        </div>
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { isEmail } from "../library/validators";
import firebase from 'firebase';
export default {
  name: "UsersCrud",
  data() {
    return {
      id: 0,
      isNew: true,
      imgUrl: "/assets/img/logo.jpg",
      imageData: null,
      imgUrlToPost: '',
      formbuilder: {
        heading: "Thông tin người dùng",
        columns: [
          {
            label: "Tên đăng nhập",
            field: "username",
            value: "",
            filterable: true,
            inputtype: true,
            placeholder: "Username of user",
            validate: {
              required
            }
          },
          {
            label: "Email",
            field: "email",
            value: "",
            filterable: true,
            inputemail: true,
            placeholder: "Email of user",
            validate: {
              required,
              isEmail
            }
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
        isLoading: false,
        buttonsavelabel: "Lưu",
        reloadFormbuilder: true
      },
      roles: [],
      properties: [],
      rolesSelected: [],
    };
  },
  methods: {
    async save(params) {
      console.log("params", params);
      this.formbuilder.disabledSave = true;
      var response;
      var patchData
        if(this.imageData != null){
          this.create()
          patchData = {
            email: params.email,
            phonenumber: params.phonenumber,
            address: params.address,
            avatar: this.imgUrlToPost
          }
        } else {
          patchData = {
            email: params.email,
            phonenumber: params.phonenumber,
            address: params.address,
          }
        }
        
        response = await this.$api.authentications.updateProfile(patchData);
        if (response != null) {
          this.formbuilder.disabledSave = true;
        }
        if (response.status < 300) {
          this.$toasted.success("Cập nhật thành công");
          this.formbuilder.disabledSave = false;
          // this.$router.push({ name: "Users" });
        } else {
          this.$toasted.error(response.message);
          this.formbuilder.disabledSave = false;
        }
    },
    click1() {
        this.$refs.input1.click()   
    },
    previewImage(event) {
        this.uploadValue=0;
        this.imgUrl=null;
        this.imageData = event.target.files[0];
        console.log("image data", this.imageData);
        this.onUpload()
    },
    onUpload(){
      this.imgUrl=null;
      const storageRef=firebase.storage().ref(`${this.imageData.name}`).put(this.imageData);
      storageRef.on(`state_changed`,snapshot=>{
          this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error=>{console.log(error.message)},
      ()=>{
          this.uploadValue=100;
          storageRef.snapshot.ref.getDownloadURL().then((url)=>{
                  this.imgUrl =url;
              });
          }      
      );
    },
    create() {
        const post = {
          photo: this.imgUrl,        
        }
        console.log(post);
        this.imgUrlToPost = post.photo
        console.log(this.imgUrlToPost);
        firebase.database().ref('PhotoGallery').push(post)
        .then((response) => {
          console.log(response);
        })
        .catch(err => {
          console.log(err)
        })
    },
    status(rowObj) {
      if(rowObj.status === true){
        return "Enable"
      }
      if(rowObj.status === false){
        return "Disable"
      }
    },
  },
  async mounted() {
      this.formbuilder.heading = "Thông tin người dùng";
      this.formbuilder.optionDisabled = true;
      var response = await this.$api.authentications.getProfile();
      var data = response.data;
      if(data.avatar != ''){
        this.imgUrl = data.avatar
      }
      if (data) {
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          this.formbuilder.columns[item].value = data[field];
          if(field == 'status') {
            if(data[field] == true) {
              this.formbuilder.columns[item].value = 'Hoạt động'
            } else this.formbuilder.columns[item].value = 'Khóa'
          }
        }
      }
  }
};
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
.products{
  margin: 20px;
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

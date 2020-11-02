<template>
  <div>
    <custom-form :formbuilder="formbuilder" :recordId="id" @form-save-click="save"></custom-form>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import { isValidDocumentLabel } from "../library/validators";
export default {
  name: "DocumentsCRUD",
  data() {
    return {
      id: "",
      formbuilder: {
        heading: "Create Document",
        columns: [
          {
            label: "Label",
            field: "label",
            value: "",
            inputtype: true,
            validate: {
              required, isValidDocumentLabel
            },
            placeholder: "Please only use lowercase letters, numbers and '-'"
          },
          {
            label: "Title",
            field: "title",
            value: "",
            inputtype: true,
            validate: {
              required
            },
          },
          {
            label: "Content",
            field: "content",
            value: "",
            textarea: true,
            rows: 10,
            validate: {
              required
            },
          },
          {
            label: "Plain Text",
            field: "plaintext",
            value: "",
            textarea: true,
            rows: 10,
            validate: {
              required
            },
          }
        ],
        disabledSave: false,
        isLoading: false,
        buttonsavelabel: "Save",
        optionDisabled: false,
        reloadFormbuilder: true
      },
      documentToPost : {
        id: "",
        type: 'document',
        attributes: {
          label: "", 
          title: "",
          content: "", 
          plaintext: "",
        },
      }
    };
  },
  methods: {
    async save(params) {
      this.formbuilder.disabledSave = true;
      this.documentToPost.attributes ={
          label: params.label,
          title: params.title,
          content: params.content, 
          plaintext: params.plaintext
      }
      if (this.$route.params.id) {
        this.documentToPost.id = this.$route.params.id
        const res = await this.$api.documents.update(this.$route.params.id, this.documentToPost)
        if(res.status === 200) {
          this.$toasted.success("Document Updated");
          this.$router.push({ name: "Documents" });
        } else{
          this.$toasted.error(res.message);
        }
      } 
      else {
        const res = await this.$api.documents.create(this.documentToPost)
        if(res.status === 201) {
          this.$toasted.success("Document Created");
          this.$router.push({ name: "Documents" });
        } else{
          this.$toasted.error(res.message);
        }
      }
    }
  },
async mounted() {
    this.id = this.$route.params.id;
    if (this.$route.params.id) {
      this.formbuilder.heading = "Update Document";
      // this.formbuilder.columns = this.formbuilder.columns.map(item => {
      //   if (item.field === "Code") {
      //     item.readonly = true;
      //   }
      //   return item;
      // });
      this.formbuilder.optionDisabled = true;
      var response = await this.$api.documents.get(this.$route.params.id);
      var data = response.data.data;
      // var value = "";
      if (data) {
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          this.formbuilder.columns[item].value = data.attributes[field];
        }
      }
    }
  }
}
</script>
<template>
  <div>
    <custom-form :formbuilder="formbuilder" :recordId="id" @form-save-click="save"></custom-form>
  </div>
</template>
<script>

export default {
  name: "TokensCRUD",
  data() {
    return {
      id: "",
      formbuilder: {
        heading: "Create Token",
        columns: [
          {
            label: "Token",
            field: "token",
            value: "will be assigned by the server on creation",
            inputtype: true,
            readonly: true
          },
          {
            label: "Description",
            field: "description",
            value: "",
            inputtype: true
          }
        ],
        disabledSave: false,
        isLoading: false,
        buttonsavelabel: "Save",
        optionDisabled: false
      },
      tokenToPost : {
        id: "",
        type: 'access_token',
        attributes: {
          token: "",
          description: "",
        },
      }
    };
  },
  methods: {
    async save(params) {
      this.tokenToPost.attributes.token = params.token
      this.tokenToPost.attributes.description = params.description

      const res = await this.$api.tokens.create(this.tokenToPost)
      if(res.status === 200) {
        this.$toasted.success("Token Created");
        this.$router.push({ name: "Tokens" });
      } else{
        this.$toasted.error(res.message);
      }
    }
  },
}
</script>
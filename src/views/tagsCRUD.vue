<template>
  <div>
    <custom-form :formbuilder="formbuilder" :recordId="id" @form-save-click="save"></custom-form>
  </div>
</template>
<script>

export default {
  name: "TagsCRUD",
  data() {
    return {
      id: "",
      formbuilder: {
        heading: "Create Tag",
        columns: [
          {
            label: "Tag",
            field: "name",
            value: "",
            inputtype: true,
          }
        ],
        disabledSave: false,
        isLoading: false,
        buttonsavelabel: "Save",
        reloadFormbuilder: true
      },
      tagType: "other"
    };
  },
  methods: {
    async save(params) {
      this.formbuilder.disabledSave = true;
      var response;
      var data = {
        attributes: {
          name: params.name,
          tag_type: this.tagType,
        },
        id: this.$route.params.id,
        type: "tag"
      }
      if (this.$route.params.id) {
        response = await this.$api.tags.update(this.$route.params.id, data);
        if (response != null) {
          this.formbuilder.disabledSave = true;
        }
        if (response.status < 300) {
          this.$toasted.success("Tag Updated");
        }
      } else {
        response = await this.$api.tags.create(data);
        if (response != null) {
          this.formbuilder.disabledSave = false;
        }
        if (response.status === 201) {
          this.$toasted.success("Tag Created");
        }
      }
      if (response.status < 300) {
        this.$router.push({ name: "Tags" });
      } else {
        this.$toasted.error(response.message);
      }
    }
  },
  async mounted() {
    this.id = this.$route.params.id;
    if (this.$route.params.id) {
      this.formbuilder.heading = "Update Tag";
      var response = await this.$api.tags.get(this.$route.params.id);
      var data = response.data.data;
      if (data) {
        this.tagType = data.attributes.tag_type 
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          switch (field) {
            case "name":
              this.formbuilder.columns[item].value = data.attributes.name;
              break;
            default:
              break
          }
        }
      }
    } else {
      this.tagType = this.$route.params.type
    }
  }
}
</script>
<template>
  <div>
    <custom-form :formbuilder="formbuilder" :recordId="id" @form-save-click="save" @add-item-to-main="addItemToMain" @add-item-to-featured="addItemToFeatured"></custom-form>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import { isValidDocumentLabel } from "../library/validators";
export default {
  name: "ViewsCRUD",
  data() {
    return {
      id: "",
      featureditem: [],
      mainitem : [],
      mainSelectionList: [],
      featuredSelectionList: [],
      formbuilder: {
        heading: "Create View",
        columns: [
          {
            label: "Id",
            field: "id",
            value: "",
            inputtype: true,
            readonly: true
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
            label: "Description",
            field: "description",
            value: "",
            inputtype: true,
            validate: {
              required
            },
          },
        ],
        disabledSave: false,
        isLoading: false,
        buttonsavelabel: "Save",
        optionDisabled: false,
        reloadFormbuilder: true
      },
      viewToPost : {
        id: "",
        type: "view",
        attributes: {
          label: "",
          title: "",
          description: "",
        },
        relationships: {
          entities: {
            data: [],
          },
          featured: {
            data: [],
          },
        },
      }
    };
  },
  methods: {
    async save(params) {
      this.formbuilder.disabledSave = true;
      this.viewToPost ={
        attributes: {
          label: params.label,
          title: params.title,
          description: params.description,
        },
        relationships: {
          entities: {
            data: this.mainitem,
          },
          featured: {
            data: this.featureditem,
          },
        },
      }
      if (this.$route.params.id) {
        this.viewToPost.id = this.$route.params.id
        const res = await this.$api.views.update(this.$route.params.id, this.viewToPost)
        if(res.status === 200) {
          this.$toasted.success("View Updated");
          this.$router.push({ name: "Views" });
        } else{
          this.$toasted.error(res.message);
        }
      } 
      else {
        const res = await this.$api.views.create(this.viewToPost)
        if(res.status === 201) {
          this.$toasted.success("Views Created");
          this.$router.push({ name: "Views" });
        } else{
          this.$toasted.error(res.message);
        }
      }
    }, 
    async addItemToMain(params) {
      this.formbuilder.reloadFormbuilder = false
      let isDuplicate = false
      this.mainitem.forEach((e) => {
        if(e.id === params){
          isDuplicate = true
        }
      })
      if(!isDuplicate){
        const collectionToAdd = await this.$api.collections.get(params);
        this.mainitem.push(collectionToAdd.data.data)
      }
    },
    async addItemToFeatured(params) {
      this.formbuilder.reloadFormbuilder = false
      let isDuplicate = false
      this.featureditem.forEach((e) => {
        if(e.id === params){
          isDuplicate = true
        }
      })
      if(!isDuplicate){
        const videoToAdd = await this.$api.videos.get(params);
        this.featureditem.push(videoToAdd.data.data)
      }
    },

    deleteEntity(params) {
      this.formbuilder.reloadFormbuilder = false
      if (params.column.field == "removebutton"){
        if(params.row.type == 'video'){
          this.featureditem.forEach((e, i) => {
            if(e.id == params.row.id) {
              this.featureditem.splice(i, 1)
              return
            }
          })
        }
        if(params.row.type == 'collection'){
          this.mainitem.forEach((e, i) => {
            if(e.id == params.row.id) {
              this.mainitem.splice(i, 1)
              return
            }
          })
        }
      }
    }
  },

async beforeMount() {
  const allVideoData = await this.$api.views.getViewFeatured()
  allVideoData.data.data.forEach((item) => {
    this.featuredSelectionList.push({
      value: item.id,
      label: item.attributes.title
    })
  })

  const allCollectionData = await this.$api.views.getViewMain()
  allCollectionData.data.data.forEach((item) => {
    this.mainSelectionList.push({
      value: item.id,
      label: item.attributes.title
    })
  })
},

async mounted() {
    this.id = this.$route.params.id;

    this.formbuilder.columns.push(
      {
        tabletype: true,
        field: "featureditem",
        props: {
          columns: [
            {
              label: "",
              field: "image",
              width: "100px",
              filterable: true,
              sortable: false,
            },
            {
              label: "Title",
              field: "attributes.title",
              sortable: false
            },
            {
              label: "Description",
              field: "attributes.description",
              width: "60%",
              sortable: false
            },
            {
              label: "",
              field: "removebutton",
              sortable: false,
              page: "entity"
            }
          ],
          norowsfound: "featured item",
          header: "Featured Items",
          searchname: "",
          data: this.featureditem,
          action: this.deleteEntity
        },
      },
      {
        groupingtype: true,
        field: "addfeatureditem",
        formbuilder: {
          heading: "",
          columns: [
            {
              label: "Add an item to Featured",
              booltype: true,
              field: "addfeatureditem",
              options: this.featuredSelectionList
            }
          ],
          disabledSave: false,
          buttonsavelabel: "Add",
          action: "add-item-to-featured",
          id: "add-item-to-featured"
        }
      },
    )

    this.formbuilder.columns.push(
      {
        tabletype: true,
        field: "mainitem",
        props: {
          columns: [
            {
              label: "",
              field: "image",
              width: "100px",
              filterable: true,
              sortable: false,
            },
            {
              label: "Title",
              field: "attributes.title",
              sortable: false
            },
            {
              label: "Description",
              field: "attributes.description",
              width: "60%",
              sortable: false
            },
            {
              label: "",
              field: "removebutton",
              sortable: false,
              page: "entity"
            }
          ],
          norowsfound: "main item",
          header: "Main Items",
          searchname: "",
          data: this.mainitem,
          action: this.deleteEntity
        },
      },
      {
        groupingtype: true,
        field: "addmainitem",
        formbuilder: {
          heading: "",
          columns: [
            {
              label: "Add an item to Main",
              booltype: true,
              field: "addmainitem",
              options: this.mainSelectionList
            }
          ],
          disabledSave: false,
          buttonsavelabel: "Add",
          action: "add-item-to-main",
          id: "add-item-to-main"
        }
      }
    )

    if (this.$route.params.id) {
      this.formbuilder.heading = "Update View";
      this.formbuilder.optionDisabled = true;
      var response = await this.$api.views.get(this.$route.params.id);
      var data = response.data;

      data.included.forEach((e) => {
        if(e.type === 'video'){
          this.featureditem.push(e)
        }
        if(e.type === 'collection'){
          this.mainitem.push(e)
        }
      })

      if (data) {
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          this.formbuilder.columns[item].value = data.data.attributes[field];
          switch (field) {
            case "featureditem":
              this.formbuilder.columns[item].props.data = this.featureditem
              break;
            case "mainitem":
              this.formbuilder.columns[item].props.data = this.mainitem
              break;
            case "id":
              this.formbuilder.columns[item].value = data.data.id;
              break;
            default:
            this.formbuilder.columns[item].value =
              data.data.attributes[field];
          }
        }
      }
    }
  }
}
</script>
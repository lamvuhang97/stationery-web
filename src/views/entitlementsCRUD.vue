<template>
  <div>
    <custom-form :formbuilder="formbuilder" :recordId="id" @form-save-click="save" @add-store-to-entitlement="addStoreToEntitlement"></custom-form>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
export default {
  name: "EntitlementsCRUD",
  data() {
    return {
      id: "",
      stores: [],
      storeList:['apple', 'google', 'roku', 'paypal', 'stripe', 'amazon'],
      storeSelectionList: [],
      formbuilder: {
        heading: "Create Entitlement",
        columns: [
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
      entitlementToPost : {
        type: 'entitlement',
        id: '',
        attributes: {
            title: '',
            description: '',
            external_product_ids: [],
        },
      }
    };
  },
  methods: {
    async save(params) {
      this.formbuilder.disabledSave = true;
      this.entitlementToPost.attributes ={
          title: params.title,
          description: params.description, 
          external_product_ids: this.stores
      }
      if (this.$route.params.id) {
        this.entitlementToPost.id = this.$route.params.id
        const res = await this.$api.entitlements.update(this.$route.params.id, this.entitlementToPost)
        if(res.status === 200) {
          this.$toasted.success("Entitlement Updated");
          this.$router.push({ name: "Entitlements" });
        } else{
          this.$toasted.error(res.message);
        }
      } 
      else {
        const res = await this.$api.entitlements.create(this.entitlementToPost)
        if(res.status === 201) {
          this.$toasted.success("Entitlement Created");
          this.$router.push({ name: "Entitlements" });
        } else{
          this.$toasted.error(res.message);
        }
      }
    },
    addStoreToEntitlement(params) {
      this.formbuilder.reloadFormbuilder = false
      let isDuplicate = false
        this.stores.forEach((e) => {
          if(e.store === params.store && e.external_id == params.external_id){
          isDuplicate = true
          }
        })
        if(!isDuplicate){
          this.stores.push(
            {
              store: params.store,
              external_id: params.external_id
            }
          )
        }
    },
    deleteEntity(params) {
        if (params.column.field == "removebutton"){
          this.stores.forEach((e, i) => {
              if(e.external_id == params.row.external_id){
                  this.stores.splice(i, 1)
                  return
              }
          })
        }
    },
  },

async mounted() {
    this.id = this.$route.params.id;

    this.storeList.forEach(item => {
      this.storeSelectionList.push(
        {
          value: item,
          label: item
        }
      )
    })

    this.formbuilder.columns.push(
      {
        tabletype: true,
        field: "stores",
        props: {
            columns: [
            {
                label: "Store",
                field: "store",
                sortable: false
            },
            {
                label: "External_id",
                field: "external_id",
                sortable: false
            },
            {
                label: "",
                field: "removebutton",
                sortable: false,
                page: "entity"
            }
            ],
            norowsfound: "store",
            header: "Stores in entitlement",
            searchname: "",
            data: this.stores,
            action: this.deleteEntity
        },
      },
      {
        groupingtype: true,
        field: "addstore",
        formbuilder: {
        heading: "",
        columns: [
            {
                label: "Choose a store",
                booltype: true,
                field: "addstore",
                options: this.storeSelectionList
            },
            {
                label: "External store id",
                inputtype: true,
                field: "addstoreid",
                value:""
            }
        ],
        disabledSave: false,
        buttonsavelabel: "Add",
        action: "add-store-to-entitlement"
        }
      },
    )

    if (this.$route.params.id) {
      this.formbuilder.heading = "Update Entitlement";
      this.formbuilder.optionDisabled = true;
      var response = await this.$api.entitlements.get(this.$route.params.id);
      var data = response.data.data;

      data.attributes.external_product_ids.forEach(item => {
          this.stores.push(item)
      })

      if (data) {
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          this.formbuilder.columns[item].value = data.attributes[field];
          switch (field) {
              case "stores":
                  this.formbuilder.columns[item].props.data = this.stores
                  break;
              default:
                  this.formbuilder.columns[item].value = data.attributes[field];
          }
        }
      }
    }
  }
}
</script>
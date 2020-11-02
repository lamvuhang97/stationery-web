<template>
  <div>
    <custom-form 
      :formbuilder="formbuilder" 
      :recordId="id" 
      @form-save-click="save" 
      @add-item-to-collection="addItemToCollection" 
      @add-entitlement-to-collection="addEntitlementToCollection" 
      @add-custom-set="addCustomSet" 
      @delete-set="deleteSet" 
      @check-selected="checkSelected" 
      @change-date-time="changeDateTime"></custom-form>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import { isValidDocumentLabel } from "../library/validators";

const momentTz = require('moment-timezone')

export default {
  name: "CollectionsCRUD",
  data() {
    return {
      id: "",
      itemsInCollection: [],
      containedInViews: [],
      collectionSelectionList: [],
      thumbnailimage: [],
      rawImageData : '',
      imageError: null,
      fileToUpload: undefined,
      requiresEntitlement: false,
      entitlementsSelectionList: [],
      entitlements: [],
      publishDate: '',
      publishTime: '',
      localdatetime: '',
      locationTypeSelected: 'no',
      locationSelectionList:[],
      locationData : [],
      savedSetSelectionList:[],
      currentSavedSet: '',
      blockableGroups: null,
      formbuilder: {
        heading: "Create Collection",
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
          {
            upimagetype : true,
            field: "thumbnailimage",
            label: "Thumbnail Image",
            buttonText: "Upload File",
            rawImageData: "",
            imageError: false,
            action: this.uploadImage
          },
          
          {
            label: "Publish Date(UTC)",
            field: "publishDate",
            value: "",
            datetype: true,
            validate: {
              required
            }
          },
          {
            label: "Publish Time(UTC)",
            field: "publishTime",
            value: "",
            timetype: true,
            validate: {
              required
            }
          },
          {
            label: "Local Date Time",
            field: "localdatetime",
            value: "",
            inputtype: true,
            readonly: true
          },
          {
            radiotype: true,
            label: "Entitlement Rules",
            field: "entitlements_rule",
            value: "none",
            options: [
              {
                value: "none",
                label: "Free"
              }, 
              {
                value: "one",
                label: "Requires an Entitlement"
              }
            ]
          },
          
          {
            radiotype: true,
            label: "Geo-blocked location",
            field: "locationtypeselected",
            value: "no",
            options: [
              {
                value: "no",
                label: "None"
              }, 
              {
                value: "custom",
                label: "Custom Set"
              }, 
              {
                value: "save",
                label: "Save Set"
              }
            ]
          },
          {
            groupingtype: true,
            hidden: true,
            field: "addlocationset",
            formbuilder: {
            heading: "",
            columns: [
                {
                  label: "Select the saved set",
                  booltype: true,
                  hidden: false,
                  field: "selectsavedset",
                  options: this.savedSetSelectionList,
                  onchange: (event) => {
                    this.formbuilder.reloadFormbuilder = false
                    this.currentSavedSet = event.target.value
                    this.blockableGroups.data.data.forEach(item => {
                      if(item.id == event.target.value){
                        this.locationData.splice(0, this.locationData.length)
                        item.attributes.blocked_locations.forEach(ele => {
                          this.locationData.push(ele.attributes.country_code)
                        })
                        for (let item in this.formbuilder.columns) {
                          var field = this.formbuilder.columns[item].field;
                          switch (field) {
                            case "addlocationset" :
                              this.formbuilder.columns[item].formbuilder.columns[1].value = this.locationData
                              break;
                            default:
                              break
                          }
                        }
                      }
                    })
                  }
                },
                {
                  label: "Choose location",
                  checkboxtype: true,
                  disabled: false,
                  value: this.locationData,
                  field: "addlocationset",
                  options: this.locationSelectionList
                },
                {
                  label: "Set Name",
                  inputtype: true,
                  hidden: false,
                  value: "",
                  field: "setname"
                },
            ],
            disabledSave: false,
            buttonsavelabel: "" ,
            action: ""
            }
          }
        ],
        disabledSave: false,
        isLoading: false,
        buttonsavelabel: "Save",
        optionDisabled: false,
        reloadFormbuilder: true
      },
      collectionToPost : {
        id: '',
        type: 'collection',
        attributes: {
          collection_type: 'playlist',
          label: '',
          title: '',
          description: '',
          images: [],
          publish_date: '',
          entitlements_rule: '',
          blocked_locations: [],
        },
        relationships: {
          entities: {
            data: [],
          },
          entitlements: {
            data: [],
          },
          entity_in: {
            data: [],
          },
        },
      }, 
      imageToPost: null
    };
  },
  methods: {
    async save(params) {
      this.formbuilder.disabledSave = true;
      const data = await this.entitlementToPost(this.entitlements)
      this.collectionToPost = {
        type: 'collection',
        attributes: {
          collection_type: 'playlist',
          label: params.label,
          title: params.title,
          description: params.description,
          publish_date: this.serverPubDateTime(params.publishDate, params.publishTime),
          entitlements_rule: this.requiresEntitlement ? 'one' : 'none',
          blocked_locations: params.checkedLocation,
          collection_method: "manual"
        },
        relationships: {
          entities: {
            data: this.entitiesToPost(this.itemsInCollection)
          },
          entitlements: {
            data: params.entitlements_rule == "none" ? [] : data,
          },
        },
      }
      let formData = new FormData()
      formData.append('image', this.fileToUpload)

      if (this.$route.params.id) {
        this.collectionToPost.id = this.$route.params.id
        const res1 = await this.$api.collections.updateCollection(this.$route.params.id, this.collectionToPost)
        
        if(res1.status === 200) {
          this.$toasted.success("Collection Updated");

          if(this.fileToUpload){
            const res2 = await this.$api.collections.updateImage(this.$route.params.id, formData)
            if(res2.status === 204) {
              this.$toasted.success("Image Updated");
            } else {
              this.$toasted.error(res2.message);
            }
          }
          
          this.$router.push({ name: "Collections" });
        } else{
          this.$toasted.error(res1.message);
        }
        
      } 
      else {
        const res = await this.$api.collections.create(this.collectionToPost)
        if(res.status === 201) {
          this.$toasted.success("Collection Created");

          if(this.fileToUpload){
            const res2 = await this.$api.collections.updateImage(this.$route.params.id, formData)
            if(res2.status === 204) {
              this.$toasted.success("Image Updated");
            } else {
              this.$toasted.error(res2.message);
            }
          }
          
          this.$router.push({ name: "Collections" });
        } else{
          this.$toasted.error(res.message);
        }
      }
    },

    entitiesToPost(data) {
      const ret =[]
      data.forEach(item => {
        ret.push(
          {
            id: item.id,
            type: item.type
          }
        )
      })
      return ret
    },

    async entitlementToPost(data) {
      const ret = []
      const values = await Promise.all(data.map(item => this.$api.entitlements.get(item.id)))
      values.forEach(res => {
        ret.push({
          description: res.data.data.attributes.description,
          id: res.data.data.id,
          title: res.data.data.attributes.title,
          external_product_ids: res.data.data.attributes.external_product_ids
        })
      })
      return ret
    },
   
   async addItemToCollection(params) {
     this.formbuilder.reloadFormbuilder = false
      let isDuplicate = false
      this.itemsInCollection.forEach((e) => {
        if(e.id === params){
          isDuplicate = true
        }
      })
      if(!isDuplicate){
        const itemToAdd = await this.$api.videos.get(params);
        this.itemsInCollection.push(itemToAdd.data.data)
      }
    },

    async addEntitlementToCollection(params) {
      this.formbuilder.reloadFormbuilder = false
      let isDuplicate = false
      this.entitlements.forEach((e) => {
        if(e.id === params){
          isDuplicate = true
        }
      })
      if(!isDuplicate){
        const itemToAdd = await this.$api.entitlements.get(params);
        this.entitlements.push(
          {
            id: params,
            title: itemToAdd.data.data.attributes.title,
            description: itemToAdd.data.data.attributes.description
          }
        )
      }
    },

    async addCustomSet(params) {
      const dataToPost = {
        data: {
          id: params.name,
          type: 'blockable_group',
          attributes: {
            blocked_locations: []
          }
        }
      }
      params.attributes.forEach(item => {
        dataToPost.data.attributes.blocked_locations.push(
          {
              type: 'blocked_location',
              attributes: {
                country_code: item.id,
                name: item.value
              }
            }
        )
      })
      const res = await this.$api.locations.create(dataToPost)
      if(res.status === "201") {
        this.$toasted.message("Created Set");
      } else{
        this.$toasted.error(res.message);
      }

      this.blockableGroups = await this.$api.locations.getgroups()
      if(this.blockableGroups) {
        this.savedSetSelectionList = []
        this.blockableGroups.data.data.forEach(item => {
          this.savedSetSelectionList.push({
            value: item.id,
            label: item.id
          })
        })
      }

      this.formbuilder.columns.forEach(item => {
        if(item.field == "addlocationset") {
          item.formbuilder.columns[0].options = this.savedSetSelectionList
        }
      })
      
    },

    async deleteSet() {
      const res = await this.$api.locations.delete(this.currentSavedSet)
      if(res.statusCode === "204") {
        this.$toasted.message("Deleted Set");
      } else{
        this.$toasted.error(res.message);
      }

      this.savedSetSelectionList.forEach((e, i) => {
        if(e.label === this.currentSavedSet){
          this.savedSetSelectionList.splice(i,1)
          return
        }
      })
      this.locationData.splice(0, this.locationData.length)
    },

    deleteItemInCollection(params) {
      if (params.column.field == "removebutton"){
        this.itemsInCollection.forEach((e, i) => {
          if(e.id == params.row.id) {
            this.itemsInCollection.splice(i, 1)
            return
          }
        })
      }
    },

    deleteEntitlement(params){
      if (params.column.field == "removebutton"){
        this.entitlements.forEach((e, i) => {
          if(e.id == params.row.id) {
            this.entitlements.splice(i, 1)
            return
          }
        })
      }
    },

    validateImageIs4k(file) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          if (img.width >= 3840 && img.height >= 2160 && this.inRange(img.width / img.height, 16.0 / 9.0, 0.05)) {
            resolve(img)
          } else {
            reject(new Error('invalid image dimensions'))
          }
        }
        const reader = new FileReader()

        reader.addEventListener('load', () => {
          img.src = reader.result.toString()
        })
        reader.readAsDataURL(file)
      })
    },

    inRange(actual, target, tolerance) {
      return Math.abs(actual - target) <= tolerance
    },

    async uploadImage(evt) {
      this.formbuilder.reloadFormbuilder = false
       try {
        const x = await this.validateImageIs4k(evt.target.files[0])
        this.rawImageData = x.src
        this.fileName = evt.target.files[0].name
        this.imageError = false
        this.fileToUpload = evt.target.files[0]
      } catch (error) {
        this.imageError = true
        evt.target.value = ''
        this.rawImageData = ''
        this.fileName = ''
        this.fileToUpload = undefined
      }

      for (let item in this.formbuilder.columns) {
        let field = this.formbuilder.columns[item].field;
        switch (field) {
        case "thumbnailimage":
          this.formbuilder.columns[item].rawImageData = this.rawImageData;
          this.formbuilder.columns[item].imageError = this.imageError;
          break;
        default:
            break;
        }
      }
    },
    
    checkSelected(params) {
      if(params.label == "entitlements_rule"){
        if(params.value == "one"){
          this.requiresEntitlement = true
        }
        if(params.value == "none") {
          this.requiresEntitlement = false 
        }
      }

      if(params.label == "locationtypeselected"){
        this.locationTypeSelected = params.value
      }
      
    },
  
    changeDateTime(params) {
      this.publishDate = params.date
      this.publishTime =params.time
      const datetime = params.date + 'T' + params.time + ':00Z'
      this.localdatetime = "(" + this.localTimeZoneAbbreviation + ")" + this.localPubDateTime(datetime)

      for (let item in this.formbuilder.columns) {
        let field = this.formbuilder.columns[item].field;
        switch (field) {
        case "localdatetime":
          this.formbuilder.columns[item].value = this.localdatetime;
          break
        case "publishDate":
          this.formbuilder.columns[item].value = this.publishDate;
          break
        case "publishTime":
          this.formbuilder.columns[item].value = this.publishTime;
          break
        default:
            break;
        }
      }

    },

    localPubDateTime(datetime) {
      return momentTz(datetime).format('M-D-YYYY h:mm a')
    },

    serverPubDateTime(date, time) {
      return date.substring(0, 11) + 'T' + time + ':00Z'
    }
  },
  computed: {
    localTimeZoneAbbreviation() {
      return momentTz()
        .tz(momentTz.tz.guess())
        .format('z')
    },
  }, 
  watch: {
    "requiresEntitlement"() {
      for (let item in this.formbuilder.columns) {
        let field = this.formbuilder.columns[item].field;
        switch (field) {
        case "addentitlement":
          this.formbuilder.columns[item].formbuilder.columns[0].disabled = !this.requiresEntitlement;
          break
        default:
            break;
        }
      }
    },
    "locationTypeSelected"(){
      for (let item in this.formbuilder.columns) {
        let field = this.formbuilder.columns[item].field;
        switch (field) {
        case "addlocationset":
          if(this.locationTypeSelected ==="no"){
            this.formbuilder.columns[item].hidden = true;
          } else {
            this.formbuilder.columns[item].hidden = false;
            if(this.locationTypeSelected === "custom"){
              this.formbuilder.columns[item].formbuilder.buttonsavelabel = "Save Set"
              this.formbuilder.columns[item].formbuilder.action = "add-custom-set"
              this.formbuilder.columns[item].formbuilder.columns[0].hidden = true
              this.formbuilder.columns[item].formbuilder.columns[2].hidden = false
            }
            if(this.locationTypeSelected === "save") {
              this.formbuilder.columns[item].formbuilder.buttonsavelabel = "Delete Set"
              this.formbuilder.columns[item].formbuilder.action = "delete-set"
              this.formbuilder.columns[item].formbuilder.columns[2].hidden =true
              this.formbuilder.columns[item].formbuilder.columns[0].hidden = false
            }
          }
          break
        default:
            break;
        }
      }
    }
  },
async beforeMount() {
  const entitlements = await this.$api.entitlements.get()
  if(entitlements) {
    entitlements.data.data.forEach(item => {
      this.entitlementsSelectionList.push({
        value: item.id,
        label: item.attributes.title,
        description: item.attributes.description
      })
    })
  }

  const allVideoData = await this.$api.views.getViewFeatured()
  allVideoData.data.data.forEach((item) => {
    this.collectionSelectionList.push({
      value: item.id,
      label: item.attributes.title
    })
  })

  const blockableLocation = await this.$api.locations.get()
  if(blockableLocation) {
    blockableLocation.data.data.forEach(item => {
      this.locationSelectionList.push({
        value: item.attributes.country_code,
        label: item.attributes.name
      })
    })
  }

  this.blockableGroups = await this.$api.locations.getgroups()
  if(this.blockableGroups) {
    this.blockableGroups.data.data.forEach(item => {
      this.savedSetSelectionList.push({
        value: item.id,
        label: item.id
      })
    })
  }

},
async mounted() {
    this.id = this.$route.params.id;

    this.formbuilder.columns.splice(5, 0, 
      {
        tabletype: true,
        field: "itemsincollection",
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
          norowsfound: " Item",
          header: "Items In Collection",
          searchname: "",
          data: this.itemsInCollection,
          action: this.deleteItemInCollection
        },
      },
      {
        groupingtype: true,
        field: "addcollectionitem",
        formbuilder: {
        heading: "",
        columns: [
          {
          label: "Add an item to Collection",
          booltype: true,
          field: "addcollectionitem",
          options: this.collectionSelectionList
            }
        ],
        disabledSave: false,
        buttonsavelabel: "Add",
        action: "add-item-to-collection",
        id: "add-item-to-collection"
        }
      },
    )

    this.formbuilder.columns.splice(11, 0 ,
      {
        tabletype: true,
        field: "entitlements",
        props: {
            columns: [
            {
                label: "Title",
                field: "title",
                sortable: false
            },
            {
                label: "Description",
                field: "description",
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
            norowsfound: "Item",
            header: "Entitlements",
            searchname: "",
            data: this.entitlements,
            action: this.deleteEntitlement
        },
      },
      {
        groupingtype: true,
        field: "addentitlement",
        formbuilder: {
        heading: "",
        columns: [
            {
            label: "Add an entitlement",
            booltype: true,
            disabled: !this.requiresEntitlement,
            field: "addentitlement",
            options: this.entitlementsSelectionList
            }
        ],
        disabledSave: false,
        buttonsavelabel: "Add",
        action: "add-entitlement-to-collection",
        id: "add-entitlement-to-collection"
        }
      },
    )

    if (this.$route.params.id) {
      this.formbuilder.heading = "Update Collection";
      this.formbuilder.optionDisabled = true;
      var response = await this.$api.collections.get(this.$route.params.id);
      var data = response.data;

      data.included.forEach((e) => {
        this.itemsInCollection.push(e)
      })

      const entitlements_rule = data.data.attributes.entitlements_rule
      this.requiresEntitlement = entitlements_rule == "none" ? false : true

      if(this.requiresEntitlement) {
        data.data.relationships.entitlements.data.forEach(item => {
          this.entitlementsSelectionList.forEach(ele => {
            if( ele.value == item.id) {
              this.entitlements.push(
                {
                  id: ele.value,
                  title: ele.label,
                  description: ele.description
                }
              )
            }
          })
        })
      }
      
      
      data.data.attributes.images.forEach(img => {
        if(img.label === "HD"){
          this.rawImageData = img.url
        }
      })

      const publishDateTime = momentTz(data.data.attributes.publish_date).tz('UTC').format('YYYY-MM-DD HH:mm:ss')
      this.publishDate = publishDateTime.substring(0, 10)
      this.publishTime = publishDateTime.substring(11, 16)

      this.localdatetime ="(" + this.localTimeZoneAbbreviation + ")" + this.localPubDateTime(data.data.attributes.publish_date)

      const views = await this.$api.views.get()
      views.data.data.forEach((view) => {
          // const viewId = view.id
          view.relationships.entities.data.forEach((entity) => {
              if(entity.id == this.$route.params.id) {
                  this.containedInViews.push(view)
              }
          })
          view.relationships.featured.data.forEach((item) => {
              if(item.id == this.$route.params.id) {
                  // if(!this.containedInViews.map(viewElem => viewElem.id).includes(viewId)){
                      this.containedInViews.push(view)
                  // }
              }
          })
      })

      if(data.data.attributes.blocked_locations){
       // this.locationData = data.data.attributes.blocked_locations
        data.data.attributes.blocked_locations.forEach(item => {
          this.locationData.push(item)
        })
      } else {
        this.locationData =[]
      }

      this.formbuilder.columns.splice(7,0, 
        {
          tabletype: true,
          field: "containedinviews",
          props: {
              columns: [
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
                  label: "View Label",
                  field: "attributes.label",
                  filterable: false,
                  sortable: false
              }
              ],
              norowsfound: "view",
              header: "Contained in views",
              searchname: "",
              data: this.containedInViews
          }, 
        },
      )

      if (data) {
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          this.formbuilder.columns[item].value = data.data.attributes[field];
          switch (field) {
            case "itemsincollection" :
                this.formbuilder.columns[item].props.data = this.itemsInCollection
                break;
            case "thumbnailimage":
                this.formbuilder.columns[item].rawImageData = this.rawImageData;
                break;
            case "publishDate":
                this.formbuilder.columns[item].value = this.publishDate;
                break;
            case "publishTime":
                this.formbuilder.columns[item].value = this.publishTime;
                break;
            case "localdatetime":
                this.formbuilder.columns[item].value = this.localdatetime;
                break;
            case "entitlements" :
                this.formbuilder.columns[item].props.data = this.entitlements
                break;
            case "addentitlement" :
                this.formbuilder.columns[item].formbuilder.columns[0].disabled = !this.requiresEntitlement
                break;
            case "locationtypeselected" :
              if(!data.data.attributes.blocked_locations) {
                this.formbuilder.columns[item].value = 'no'
              } else {
                this.formbuilder.columns[item].value = 'custom'
              }
              break
            case "addlocationset" :
              this.formbuilder.columns[item].formbuilder.columns[1].options = this.locationSelectionList;
              this.formbuilder.columns[item].formbuilder.columns[0].options = this.savedSetSelectionList;
              if(this.locationData.length > 0) {
                this.formbuilder.columns[item].hidden = false;
                this.formbuilder.columns[item].formbuilder.columns[1].value = this.locationData
                this.formbuilder.columns[item].formbuilder.buttonsavelabel = "Save Set"
                this.formbuilder.columns[item].formbuilder.action = "add-custom-set"
                this.formbuilder.columns[item].formbuilder.columns[0].hidden = true
                this.formbuilder.columns[item].formbuilder.columns[2].hidden = false
              } else {
                this.formbuilder.columns[item].hidden = true;
                this.formbuilder.columns[item].formbuilder.columns[1].value = this.locationData
              }
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
<template>
  <div>
    <custom-form
      :formbuilder="formbuilder"
      :recordId="id"
      @form-save-click="save"
      @add-entitlement-to-video="addEntitlementToVideo"
      @add-custom-set="addCustomSet"
      @delete-set="deleteSet"
      @check-selected="checkSelected"
      @change-date-time="changeDateTime"
      @search-video-source="searchVideoSources"
      @select-event="selectEvent"
      @upload-video-file="uploadVideoFile"
    ></custom-form>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
//import { isValidDocumentLabel } from "../library/validators";

const momentTz = require('moment-timezone')

export default {
  name: "VideosCRUD",
  data() {
    return {
      id: "",
      VideoSelectionList: [],
      thumbnailimage: [],
      rawImageData : '',
      imageError: null,
      fileToUpload: undefined,
      requiresEntitlement: false,
      entitlementsSelectionList: [],
      entitlements: [],
      publishDate: '',
      publishTime: '',
      publishLocalTime: '',
      airDate: '',
      airTime: '',
      airLocalTime: '',
      endDate: '',
      endTime: '',
      endLocalTime: '',
      locationTypeSelected: 'no',
      locationSelectionList:[],
      locationData : [],
      savedSetSelectionList:[],
      currentSavedSet: '',
      blockableGroups: null,
      videoSources: [],
      currentVideoSource: '',
      entity_in: {},
      video_type: '',
      formbuilder: {
        heading: "Create Video",
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
            label: "Label",
            field: "label",
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
            rows: 3,
            textarea: true,
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
            label: "Video Source",
            labeltype: true,
          },
          {
            label: "Type",
            booltype: true,
            field: "video_type",
            disabled: this.video_type === "live",
            options: [
              {
                label: "VOD",
                value: "vod"
              },
              {
                label: "LINEAR",
                value: "linear"
              },
              {
                label: "LIVE",
                value: "live"
              }
            ],
            onchange: (event) => {
              this.video_type = event.target.value
            }
          },
          {
            label: "File",
            multiselecttype: true,
            field: "source",
            labelBy: "name",
            placeholder: "Select a video source... (or type 3 or more characters to search)",
            options: [],
            action: "search-video-source",
            invisible: this.video_type !== "vod"
          },
          {
            label: "Video",
            groupingtype: true,
            field: "video",
            id: "video",
            invisible : this.video_type !== "vod",
            formbuilder: {
              heading: "",
              columns: [
                {
                  videotype: true,
                  field: "video",
                  label: "label",
                  value: this.currentVideoSource,
                }
              ], 
              disabledSave: false,
              buttonsavelabel: "Upload video file" ,
              action: "upload-video-file",
            },
          },
          {
            label: "URL",
            inputtype: true,
            placeholder: "Enter the url of the 24/7 linear video stream",
            field: "url",
            invisible: this.video_type !== "linear"
          },
          {
            label: "RTMP Endpoint",
            booltype: true,
            field: "rtmp",
            options: [
              { 
                label: 'rtmp://34.211.217.197/live/channel01',
                value: 'rtmp://34.211.217.197/live/channel01'
              },
              { 
                label: 'rtmp://54.71.200.18/live/channel02',
                value: 'rtmp://54.71.200.18/live/channel02'
              },
              { 
                label: 'rtmp://35.161.130.106/live/channel03',
                value: 'rtmp://35.161.130.106/live/channel03'
              }
            ],
            invisible: this.video_type !== "live"
          },
          {
            label: "Stream Key",
            inputtype: true,
            field: "stream_key",
            readonly: true,
            invisible: this.video_type !== "live"
          },
          {
            label: "Tags",
            labeltype: true,
            field: "labelTags"
          },
          {
            label: "Show",
            booltype: true,
            field: "show_tag_name",
            options: []
          },
          {
            label: "Season/Year",
            numbertype: true,
            field: "season_year"
          },
          {
            label: "Show Type",
            multiselecttype: true,
            field: "show_type",
            placeholder: "Choose a show type",
            options: [],
          },
          {
            label: "Other Tags",
            multiselecttype: true,
            field: "other_tags",
            options: [],
            placeholder: "Search for tags...",
            labelBy: "name",
            multiple: true,
            taggeble: true,
            hideSelected: true,
            trackBy: "id"
          },
          {
            label: "Publish",
            labeltype: true,
            field: "labelPublish"
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
            field: "publishLocalTime",
            value: "",
            inputtype: true,
            readonly: true
          },
          {
            label: "Air",
            labeltype: true,
            field: "labelAir"
          },
          {
            label: "Air Date(UTC)",
            field: "airDate",
            value: "",
            datetype: true,
            validate: {
              required
            }
          },
          {
            label: "Air Time(UTC)",
            field: "airTime",
            value: "",
            timetype: true,
            validate: {
              required
            }
          },
          {
            label: "Local Date Time",
            field: "airLocalTime",
            value: "",
            inputtype: true,
            readonly: true
          },
          {
            label: "End",
            labeltype: true,
            field: "labelEnd",
            invisible: this.video_type !== "live"
          },
          {
            label: "End Date(UTC)",
            field: "endDate",
            value: "",
            datetype: true,
            validate: {
              required: (this.video_type == "live" ? required : '')
            },
            invisible: this.video_type !== "live"
          },
          {
            label: "End Time(UTC)",
            field: "endTime",
            value: "",
            timetype: true,
            validate: {
              required: (this.video_type == "live" ? required : '')
            },
            invisible: this.video_type !== "live"
          },
          {
            label: "Local Date Time",
            field: "endLocalTime",
            value: "",
            inputtype: true,
            readonly: true,
            invisible: this.video_type !== "live"
          },
          {
            label: "Rules",
            labeltype: true,
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
                        this.locationData =[]
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
                  value: [],
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
      videoToPost : {
        attributes : {
          
          video_type: '',
          label: '',
          title: '',
          description: '',
          images: [],
          publish_date: '',
          air_date: '',
          end_date: '',
          source: '',
          entitlements_rule: '',
          locations: [],
          blocked_locations: [],
          live_endpoint: ''
        },
        id: '',
        relationships: {
          entitlements: {
            data :[]
          }
        }
      }, 
      imageToPost: null,
      showTags: [],
      otherTags: [],
    };
  },
  methods: {
    async save(params) {
      this.formbuilder.disabledSave = true;
      const data = await this.entitlementToPost(this.entitlements)
      const showTagIdx = this.showTags.findIndex(item => item.value === params.show_tag_name)
      const showTagData = {
        id: params.show_tag_name,
        name: this.showTags[showTagIdx].label,
        season_year: params.season_year,
        show_type: params.show_type,
        tag_type: "show"
      }
      this.videoToPost = {
        attributes : {
          video_type: params.video_type,
          label: params.label,
          title: params.title,
          description: params.description,
          publish_date: this.serverDateTime(params.publishDate, params.publishTime),
          air_date: this.serverDateTime(params.airDate, params.airTime) ,
          source: params.source || params.url || params.rtmp,
          entitlements_rule:  this.requiresEntitlement ? 'one' : 'none',
          blocked_locations: params.checkedLocation,
          live_endpoint: '' || params.live_endpoint
        },
        id: this.$route.params.id,
        type: "video",
        relationships: {
          entitlements: {
            data :this.entitlements_rule == "none" ? [] : data
          },
          other_tags: {
            data: params.other_tags
          },
          show_tag: {
            data: showTagData
          }
        }
      }

      if(params.endDate) {
        this.videoToPost.attributes.end_date = this.serverDateTime(params.endDate, params.endTime)
      }

      let formData = new FormData()
      formData.append('image', this.fileToUpload)
      
      if (this.$route.params.id) {
        const res1 = await this.$api.videos.updateVideo(this.$route.params.id, {data: this.videoToPost})
        
        if(res1.status === 200) {
          this.$toasted.success("Video Updated");

          if(this.fileToUpload){
            const res2 = await this.$api.videos.updateImage(this.$route.params.id, formData)
            if(res2.status === 204) {
              this.$toasted.success("Image Updated");
            } else {
              this.$toasted.error(res2.message);
            }
          }
          
          this.$router.push({ name: "Videos" });
        } else{
          this.$toasted.error(res1.message);
        }
        
      } 
      else {
        const res = await this.$api.videos.create({data: this.videoToPost})
        if(res.status === 201) {
          this.$toasted.success("Video Created");

          if(this.fileToUpload){
            const res2 = await this.$api.videos.updateImage(this.$route.params.id, formData)
            if(res2.status === 204) {
              this.$toasted.success("Image Updated");
            } else {
              this.$toasted.error(res2.message);
            }
          }
          
          this.$router.push({ name: "Videos" });
        } else{
          this.$toasted.error(res.message);
        }
      }
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

    async addEntitlementToVideo(params) {
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
      this.formbuilder.columns.forEach(col => {
          if(col.field == "entitlements"){
              col.props.data = this.entitlements
          }
      })
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

    uploadVideoFile() {
      this.$router.push({ name: "UploadVideoFile" });
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
      let datetime 
      switch (params.type) {
        case "publish":
          this.publishDate = params.date
          this.publishTime = params.time
          datetime = params.date + 'T' + params.time + ':00Z'
          this.publishLocalTime = "(" + this.localTimeZoneAbbreviation + ")" + this.localDateTime(datetime)
          break
        case "air":
          this.airDate = params.date
          this.airTime =params.time
          datetime = params.date + 'T' + params.time + ':00Z'
          this.airLocalTime = "(" + this.localTimeZoneAbbreviation + ")" + this.localDateTime(datetime)
          break
        case "end":  
          this.endDate = params.date
          this.endTime =params.time
          datetime = params.date + 'T' + params.time + ':00Z'
          this.endLocalTime = "(" + this.localTimeZoneAbbreviation + ")" + this.localDateTime(datetime)
          break
      }
      for (let item in this.formbuilder.columns) {
        let field = this.formbuilder.columns[item].field;
        switch (field) {
          case "publishDate":
              this.formbuilder.columns[item].value = this.publishDate;
              break;
          case "publishTime":
              this.formbuilder.columns[item].value = this.publishTime;
              break;
          case "publishLocalTime":
              this.formbuilder.columns[item].value = this.publishLocalTime;
              break;
          case "airDate":
              this.formbuilder.columns[item].value = this.airDate;
              break;
          case "airTime":
              this.formbuilder.columns[item].value = this.airTime;
              break;
          case "airLocalTime":
              this.formbuilder.columns[item].value = this.airLocalTime;
              break;
          case "endDate":
              this.formbuilder.columns[item].value = this.endDate;
              break;
          case "endTime":
              this.formbuilder.columns[item].value = this.endTime;
              break;
          case "endLocalTime":
              this.formbuilder.columns[item].value = this.endLocalTime;
              break;
          default:
            break;
        }
      }
    },

    localDateTime(datetime) {
      return momentTz(datetime).format('M-D-YYYY h:mm a')
    },

    serverDateTime(date, time) {
      return date.substring(0, 11) + 'T' + time + ':00Z'
    },
    selectEvent(params){
      this.formbuilder.reloadFormbuilder = false
      this.formbuilder.columns.forEach(item => {
        if(item.field == "video"){
          item.formbuilder.columns[0].value = params
        }
      })
    },
    buildDataVideoSource(data) {
      const sources = []
      data.forEach(item => {
        sources.push({
          id: item.id,
          name: item.attributes.name,
          size: item.attributes.size,
          created_at: item.attributes.created_at,
          updated_at: item.attributes.updated_at,
          status: item.attributes.status,
          value: item.id,
          label: item.attributes.name
        })
      })
      const idx = this.formbuilder.columns.findIndex(item => item.field === "source")
      this.formbuilder.columns[idx].options = sources
    },
    async searchVideoSources(term) {
      const filteredSource = await this.$api.videos.searchVideoSources(term)
      if (filteredSource) {
        this.buildDataVideoSource(filteredSource.data.data)
      }
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
    },
    "video_type"(){
      for (let item in this.formbuilder.columns) {
        let field = this.formbuilder.columns[item].field;
        switch (field) {
        case "video_type":
          this.formbuilder.columns[item].value = this.video_type
          break
        case "source":
        case "video":
          this.formbuilder.columns[item].invisible = this.video_type !== "vod"
          break
        case "url":
          this.formbuilder.columns[item].invisible = this.video_type !== "linear"
          break
        case "rtmp":
        case "stream_key":
        case "labelEnd":
        case "endDate":
        case "endTime":
        case "endLocalTime":
          this.formbuilder.columns[item].invisible = this.video_type !== "live"
          break
        default:
            break;
        }
      }
    }
  },
  async beforeMount() {

  },
  async mounted() {
    this.id = this.$route.params.id;

    const pos = this.formbuilder.columns.findIndex(item => item.field === "entitlements_rule")
    this.formbuilder.columns.splice(pos + 1,0,
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
      action: "add-entitlement-to-video",
      id: "add-entitlement-to-video"
      }
    },
    )
    const allTags = await this.$api.tags.get(null)
    if (allTags) {
      allTags.data.data.forEach(element => {
        if (element.attributes.tag_type === 'show') {
          this.showTags.push({
            label: element.attributes.name,
            value: element.id
          })
        } else {
          this.otherTags.push({
            id: element.id,
            name: element.attributes.name,
            tag_type: "other"
          })
        }
      })
      const idxShow = this.formbuilder.columns.findIndex(item => item.field === "show_tag_name")
      this.formbuilder.columns[idxShow].options = this.showTags
      const idxOther = this.formbuilder.columns.findIndex(item => item.field === "other_tags")
      this.formbuilder.columns[idxOther].options = this.otherTags
    }
    const allshowTypes = await this.$api.tags.getShowTypes()
    if (allshowTypes) {
      const idx = this.formbuilder.columns.findIndex(item => item.field === "show_type")
      this.formbuilder.columns[idx].options = allshowTypes.data.data
    }
    const entitlements = await this.$api.entitlements.get()
    if (entitlements) {
      entitlements.data.data.forEach(item => {
        this.entitlementsSelectionList.push({
          value: item.id,
          label: item.attributes.title,
          description: item.attributes.description
        })
      })
      const idx = this.formbuilder.columns.findIndex(item => item.field === "addentitlement")
      this.formbuilder.columns[idx].formbuilder.columns[0].options = this.entitlementsSelectionList
    }

    const blockableLocation = await this.$api.locations.get()
    if (blockableLocation) {
      blockableLocation.data.data.forEach(item => {
        this.locationSelectionList.push({
          value: item.attributes.country_code,
          label: item.attributes.name
        })
      })
      const idx = this.formbuilder.columns.findIndex(item => item.field === "addlocationset")
      this.formbuilder.columns[idx].formbuilder.columns[1].options = this.locationSelectionList
    }
    const videoSourcesResp = await this.$api.videos.getVideoSources()
    if (videoSourcesResp) {
      this.videoSources = this.buildDataVideoSource(videoSourcesResp.data.data)
    }
    this.blockableGroups = await this.$api.locations.getgroups()
    if(this.blockableGroups) {
      this.blockableGroups.data.data.forEach(item => {
        this.savedSetSelectionList.push({
          value: item.id,
          label: item.id
        })
      })
      const idx = this.formbuilder.columns.findIndex(item => item.field === "addlocationset")
      this.formbuilder.columns[idx].formbuilder.columns[0].options = this.savedSetSelectionList
    }
    if (this.$route.params.id) {
      this.formbuilder.heading = "Update Video";
      var response = await this.$api.videos.get(this.$route.params.id);
      var data = response.data;

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
      this.entity_in = data.data.relationships.entity_in
      const publishDateTime = momentTz(data.data.attributes.publish_date).tz('UTC').format('YYYY-MM-DD HH:mm:ss')
      this.publishDate = publishDateTime.substring(0, 10)
      this.publishTime = publishDateTime.substring(11, 16)
      this.publishLocalTime ="(" + this.localTimeZoneAbbreviation + ")" + this.localDateTime(data.data.attributes.publish_date)

      const airDateTime = momentTz(data.data.attributes.air_date).tz('UTC').format('YYYY-MM-DD HH:mm:ss')
      this.airDate = airDateTime.substring(0, 10)
      this.airTime = airDateTime.substring(11, 16)
      this.airLocalTime ="(" + this.localTimeZoneAbbreviation + ")" + this.localDateTime(data.data.attributes.air_date)

      const endDateTime = momentTz(data.data.attributes.end_date).tz('UTC').format('YYYY-MM-DD HH:mm:ss')
      this.endDate = endDateTime.substring(0, 10)
      this.endTime = endDateTime.substring(11, 16)
      this.endLocalTime ="(" + this.localTimeZoneAbbreviation + ")" + this.localDateTime(data.data.attributes.end_date)

      if(data.data.attributes.blocked_locations){
        data.data.attributes.blocked_locations.forEach(item => {
          this.locationData.push(item)
        })
      } else {
        this.locationData =[]
      }

      if(data.data.attributes.source) {
        this.currentVideoSource = data.data.attributes.source
      }

      if (data) {
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          this.formbuilder.columns[item].value = data.data.attributes[field];
          switch (field) {
            case "video_type":
              this.video_type = data.data.attributes.video_type
              this.formbuilder.columns[item].value = data.data.attributes[field];
              this.formbuilder.columns[item].disabled = this.video_type === "live";
              break
            case "source", "url", "rtmp":
              this.formbuilder.columns[item].value = data.data.attributes.source;
              break
            case "thumbnailimage":
                this.formbuilder.columns[item].rawImageData = this.rawImageData;
                break;
            case "video" :
                this.formbuilder.columns[item].formbuilder.columns[0].value = this.currentVideoSource
                break;
            case "publishDate":
                this.formbuilder.columns[item].value = this.publishDate;
                break;
            case "publishTime":
                this.formbuilder.columns[item].value = this.publishTime;
                break;
            case "publishLocalTime":
                this.formbuilder.columns[item].value = this.publishLocalTime;
                break;
            case "airDate":
                this.formbuilder.columns[item].value = this.airDate;
                break;
            case "airTime":
                this.formbuilder.columns[item].value = this.airTime;
                break;
            case "airLocalTime":
                this.formbuilder.columns[item].value = this.airLocalTime;
                break;
            case "endDate":
                this.formbuilder.columns[item].value = this.endDate;
                break;
            case "endTime":
                this.formbuilder.columns[item].value = this.endTime;
                break;
            case "endLocalTime":
                this.formbuilder.columns[item].value = this.endLocalTime;
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
              break;
            case "addlocationset" :
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
            case "show_tag_name":
              this.formbuilder.columns[item].value = data.data.relationships.show_tag.data.id
              break;
            case "season_year":
            case "show_type":
              this.formbuilder.columns[item].value = data.data.relationships.show_tag.data[field]
              break;
            case "other_tags":
              this.formbuilder.columns[item].value = data.data.relationships.other_tags.data
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
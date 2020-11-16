<template>
  <div class="card">
    <div v-if="formbuilder.heading.length > 0" class="card-header">
      <h5 class="mb-0">{{ formbuilder.heading }}</h5>
    </div>
    <div class="card-body">
      <form :id="formbuilder.id ? formbuilder.id : 'form'">
        <div v-for="item in formbuilder.columns" :key="item.field">
          <div class="form-group">
            <span v-if="item.labeltype && !item.invisible">
              <div class="input-group">
                <span class="label">{{ item.label }}</span>
              </div>
            </span>
            <span v-if="item.inputtype && !item.invisible">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }" :hidden ="item.hidden">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <input
                  class="form-control"
                  type="text"
                  :readonly="item.readonly"
                  v-model.trim.lazy="$v.form[item.field].$model"
                  :placeholder="
                    !$v.form[item.field].$error ? item.placeholder : ''
                  "
                  :forcenumber="item.forcenumber"
                  :forcefloat="item.forcefloat"
                  :name="item.field"
                />
                <span class="help-block">
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        $v.form[item.field].required == false
                    "
                  >Required</span>
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        $v.form[item.field].isValidDocumentLabel == false
                    "
                  >Please only use lowercase letters, numbers and '-'</span>
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        $v.form[item.field].notAllowField == false
                    "
                  >
                    Cannot accept
                    {{ $v.form[item.field].$params.notAllowField.key }} have a
                    value
                  </span>
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        $v.form[item.field].isPositiveIntegerNumber == false
                    "
                  >It must be a positive integer</span>
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        $v.form[item.field].isPositiveDecimalNumber == false
                    "
                  >It must be a positive decimal</span>
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        $v.form[item.field].matchRegex == false
                    "
                  >
                    {{
                    $v.form["DiscountValue"].$params.matchRegex.message
                    }}
                  </span>
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        $v.form[item.field].max == false
                    "
                  >
                    Max codes to generate are 50K at a time. Please reduce
                    number.
                  </span>
                </span>
                <div class="input-group-append"></div>
              </div>
            </span>
            <span v-if="item.inputpassword">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <input
                  class="form-control"
                  type="password"
                  :readonly="item.readonly"
                  v-model.trim.lazy="$v.form[item.field].$model"
                  :placeholder="
                    !$v.form[item.field].$error ? item.placeholder : ''
                  "
                  :forcenumber="item.forcenumber"
                  :name="item.field"
                />
                <div class="input-group-append"></div>
              </div>
              <span class="help-block">
                <span
                  v-if="
                    $v.form[item.field].$error &&
                      $v.form[item.field].required == false
                  "
                >Required</span>
              </span>
            </span>
            <span v-if="item.inputemail">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <input
                  class="form-control"
                  type="email"
                  v-model.trim.lazy="$v.form[item.field].$model"
                  :placeholder="
                    !$v.form[item.field].$error ? item.placeholder : ''
                  "
                  :forcenumber="item.forcenumber"
                  :name="item.field"
                />
                <div class="input-group-append"></div>
                <span class="help-block">
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        $v.form[item.field].required == false
                    "
                  >Required</span>
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        $v.form[item.field].email == false
                    "
                  >Email format required</span>
                </span>
              </div>
            </span>
            <span
              v-else-if="item.textarea"
              :class="{ 'form-group--error': $v.form[item.field].$error }"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <textarea
                  class="form-control"
                  type="text"
                  :readonly="item.readonly"
                  v-model.trim.lazy="$v.form[item.field].$model"
                  :rows="item.rows"
                  :cols="item.cols"
                  :placeholder="
                    !$v.form[item.field].$error ? item.placeholder : ''
                  "
                  :name="item.field"
                ></textarea>
                <div class="input-group-append"></div>
                <span class="help-block">
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        $v.form[item.field].required == false
                    "
                  >Required</span>
                </span>
              </div>
            </span>
            <span
              v-else-if="item.divtype"
            >
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <div
                  class="form-control form-text-area"
                >
                  {{ item.value }}
                </div>
                <div class="input-group-append"></div>
              </div>
            </span>
            <span v-else-if="item.datetype && !item.invisible">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <input
                  class="form-control"
                  type="date"
                  :readonly="item.readonly"
                  v-model.trim.lazy="$v.form[item.field].$model"
                  :name="item.field"
                  :forcedate="true"
                  @change="changeDateTime"
                />
                <div class="input-group-append"></div>
                <span class="help-block">
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        !$v.form[item.field].isDate &&
                        $v.form[item.field].$model != ''
                    "
                  >Invalid date</span>
                </span>
              </div>
            </span>
            <span v-else-if="item.timetype && !item.invisible">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <input
                  class="form-control"
                  type="time"
                  :readonly="item.readonly"
                  v-model.trim.lazy="$v.form[item.field].$model"
                  :name="item.field"
                  @change="changeDateTime($event)"
                />
                <div class="input-group-append"></div>
                <span class="help-block">
                  <span
                    v-if="
                      $v.form[item.field].$error &&
                        !$v.form[item.field].isDate &&
                        $v.form[item.field].$model != ''
                    "
                  >Invalid date</span>
                </span>
              </div>
            </span>
            <span v-else-if="item.booltype && !item.invisible">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }" :hidden="item.hidden">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <select
                  class="form-control"
                  :name="item.field"
                  :readonly="item.readonly"
                  v-model.trim.lazy="$v.form[item.field].$model"
                  :disabled="
                    item.disabled ||
                      (formbuilder.optionDisabled && item.field == 'PlanID')
                  "
                  @change="item.onchange ? item.onchange($event) : ()=>{}"
                >
                  <option
                    v-for="option in item.options"
                    :selected="(item.value && option.value == item.value) || option.selected"
                    :value="option.value"
                    :key="option.label"
                    :disabled="option.disable"
                    :hidden="option.hidden"
                  >{{ option.label }}</option>
                </select>
                <div class="input-group-append"></div>
              </div>
            </span>
            <span v-else-if="item.multiselecttype && !item.invisible">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }" :hidden="item.hidden">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <multiselect
                  class="form-control"
                  :id="item.field"
                  v-model.trim.lazy="$v.form[item.field].$model"
                  :options="item.options"
                  :allow-empty="true"
                  :placeholder="item.placeholder"
                  :label="item.labelBy"
                  @select="selectEvent"
                  :taggable="item.taggable"
                  :multiple="item.multiple"
                  :hide-selected="item.hideSelected"
                  :track-by="item.trackBy"
                  @search-change="onMultiSelectChange($event, item.action)"
                ></multiselect>
                <div class="input-group-append"></div>
              </div>
            </span>
            <span v-else-if="item.radiotype" class="radios">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }" :id="item.field">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <div v-for="option in item.options" :key="option.value" class="radio-item" >
                  <span>
                    <input 
                      type="radio" 
                      :id="option.value" 
                      :name="item.field"
                      v-model.trim.lazy="$v.form[item.field].$model"
                      :value="option.value"
                      @click="checkSelected">
                    <label :for="option.value">{{option.label}}</label><br>
                  </span>
                </div>
                <div class="input-group-append"></div>
              </div>
            </span>

            <span v-else-if="item.checkboxtype" class="checkbox">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }" :id="item.field">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <div v-for="option in item.options" :key="option.value" class="checkbox-item" >
                  <span>
                    <input 
                      type="checkbox" 
                      :id="option.value" 
                      :name="item.field"
                      :value="option.label"
                      :checked="(item.value != []) ? item.value.includes(option.value) : ''"
                      :click="() => {}">
                    <label :for="option.value">{{option.label}}</label><br>
                  </span>
                </div>
                <div class="input-group-append"></div>
              </div>
            </span>
            <span v-if="item.videotype">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }">
                <div class="form-field-boxed">
                  <div class="video-container">
                    <video 
                      width="500" 
                      controls
                      :src="'https://content.jwplatform.com/videos/' + item.value + '.mp4'">
                    </video>
                  </div>
                </div>
                <div class="input-group-append"></div>
              </div>
              <span class="help-block">
                <span
                  v-if="
                    $v.form[item.field].$error &&
                      $v.form[item.field].required == false
                  "
                >Required</span>
              </span>
            </span>
            <span v-if="item.upimagetype">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <div class="form-field-boxed">
                  <p>Choose a 4K UHD Image for the Collection (3840px × 2160px)</p>
                  <upload-file id="imageButton" :button-text="item.buttonText" @updateFile="(params) =>item.action(params)" />
                  
                  <div class="img-container">
                    <img :v-if="item.rawImageData != ''" class="image" :src="item.rawImageData" width="300px" />
                    <p v-if="item.imageError" class="warning">Image must be 4K UHD - 3840px × 2160px.</p>
                  </div>
                </div>
                <div class="input-group-append"></div>
              </div>
              <span class="help-block">
                <span
                  v-if="
                    $v.form[item.field].$error &&
                      $v.form[item.field].required == false
                  "
                >Required</span>
              </span>
            </span>
            <span v-if="item.upvideotype">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }">
                <div class="form-field-boxed">
                  <upload-file id="imageButton" :button-text="item.buttonText" @updateFile="(params) =>item.action(params)" />
                </div>
                <div class="input-group-append"></div>
              </div>
              <span class="help-block">
                <span
                  v-if="
                    $v.form[item.field].$error &&
                      $v.form[item.field].required == false
                  "
                >Required</span>
              </span>
            </span>

            <span v-if="item.numbertype">
              <div class="input-group" :class="{ 'form-group--error': $v.form[item.field].$error }">
                <div class="input-group-prepend">
                  <span class="input-group-text">{{ item.label }}</span>
                </div>
                <input
                  class="form-control"
                  type="number"
                  :readonly="item.readonly"
                  v-model.trim.lazy="$v.form[item.field].$model"
                  :placeholder="
                    !$v.form[item.field].$error ? item.placeholder : ''
                  "
                  :forcenumber="true"
                  :name="item.field"
                  :disabled="item.disable"
                />
                <div class="input-group-append"></div>
              </div>
              <span class="help-block">
                <span
                  v-if="
                    $v.form[item.field].$error &&
                      $v.form[item.field].required == false
                  "
                >Required</span>
              </span>
            </span>
            <span v-else-if="item.groupingtype && !item.invisible">
              <custom-form
                :formbuilder="item.formbuilder" :recordId="item.id" @form-save-click="saveGroupingForm(item.formbuilder.action)" :hidden="item.hidden"
              ></custom-form>
            </span>
            <span v-else-if="item.tabletype">
              <custom-table
                :props="item.props"
                :reload="false"
                :filter="[]"
                @cell-click="(params) => item.props.action ? item.props.action(params) : {}"
                @row-click="rowClick"
              ></custom-table>
            </span>
          </div>
        </div>

        <div class="form-group">
          <button
            v-if="!formbuilder.hiddenSave"
            class="btn btn-primary"
            type="button"
            @click="saveForm"
            :disabled="formbuilder.disabledSave || formbuilder.disbaleSaveBtn"
          >
            <i v-if="formbuilder.disabledSave" class="fa fa-spinner fa-spin"></i>
            {{ formbuilder.buttonsavelabel }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import UploadFile from '@/components/global/UploadFile.vue'
import Multiselect from 'vue-multiselect'

export default {
  name: "custom-form",
  props: {
    recordId: {
      type: String,
      required: false
    },
    formbuilder: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columns: [],
      form: {}
    };
  },
  validations() {
    let validations = {};
    this.formbuilder.columns.forEach(element => {
      if (element.validate) {
        validations[element.field] = element.validate;
      } else {
        validations[element.field] = {};
      }
    });
    return {
      form: validations
    };
  },
  methods: {
    rowClick(params) {
      var type = params.row.type
      switch(type){
        case "video":
          this.$router.push({ name: "VideosUpdate", params: params.row });
          break;
        case "collection":
          if(this.$route.path == "/collections/update"){
            // do something
          } else {
            this.$router.push({ name: "CollectionsUpdate", params: params.row });
          }
          break;
        case "view":
          this.$router.push({ name: "ViewsUpdate", params: params.row });
          break;
        default:
          break;
      }
    },
    selectEvent(selected) {
      this.$emit("select-event", selected.value)  
    },
    saveForm() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      let params = this.$v.form.$model
      const checkboxvalue = document.getElementsByName("addlocationset")
      const checkedLocation =[]
      const locationType = document.getElementsByName("locationtypeselected")
      locationType.forEach(item => {
        if(item.checked) {
          if(item.id != "no") {
            checkboxvalue.forEach(item => {
              if(item.checked){
                checkedLocation.push(item.id)
              }
            })
            params['checkedLocation'] = checkedLocation
          }
        }
      })

      const videotag = document.getElementsByTagName("video")[0]
      if(videotag) {
        const source = videotag.src.replace('https://content.jwplatform.com/videos/','').replace('.mp4', '')
        params['source'] = source
      }
      
      this.$emit("form-save-click", params);
    },
    checkSelected($e) {
      let params={}

      if($e.target.name === "entitlements_rule"){
        params.label = $e.target.name
        params.value = $e.target.id
        this.$emit("check-selected", params)
        return
      }

      if($e.target.name === "locationtypeselected"){
        params.label = $e.target.name
        params.value = $e.target.id
        this.$emit("check-selected", params)
        return
      }

    },

    changeDateTime(event) {
      const e = event.target
      var type
      var date
      var time
      if (e.name.includes("Date")) {
        type = e.name.replace("Date","")
      }
      if (e.name.includes("Time")) {
        type = e.name.replace("Time","")
      }
      date = this.$v.form[type + "Date"].$model
      time = this.$v.form[type + "Time"].$model
      const params = {
        type,
        date,
        time
      }
      this.$emit("change-date-time", params)
    },
    onMultiSelectChange(query, action) {
      if (query.length >= 3) {
        this.$emit(action, query)
      }
    },
    saveGroupingForm(action) {
      let params = {}
      var i
      if (action === "send-reset-pw") {
        this.$emit(action, params);
      }
      if (action === "add-entitlement" || action === "add-role") {
        const data = document.getElementById(action);
        for (i = 0; i < data.elements.length; i++) {
          if (data.elements[i].name.length > 0) {
            if (data.elements[i].getAttribute("forcenumber")) {
              params[data.elements[i].name] = parseInt(data.elements[i].value);
            } else {
              params[data.elements[i].name] = data.elements[i].value;
            }
          }
        }
        this.$emit(action, params);
        return
      }

      if (action === "add-item-to-featured") {
        let params =''
        const data = document.getElementById("add-item-to-featured");
        for (i = 0; i < data.elements.length; i++) {
          if (data.elements[i].name.length > 0) {
            params = data.elements[i].value;
          }
        }
        this.$emit(action, params);
        return
      }

      if (action === "add-item-to-main") {
        let params =''
        const data = document.getElementById("add-item-to-main");
        for (i = 0; i < data.elements.length; i++) {
          if (data.elements[i].name.length > 0) {
            params = data.elements[i].value;
          }
        }
        this.$emit(action, params);
        return
      }

      if (action === "add-item-to-collection") {
        let params =''
        const data = document.getElementById("add-item-to-collection");
        for (i = 0; i < data.elements.length; i++) {
          if (data.elements[i].name.length > 0) {
            params = data.elements[i].value;
          }
        }
        this.$emit(action, params);
        return
      }

      if (action === "add-entitlement-to-collection") {
        let params =''
        const data = document.getElementById("add-entitlement-to-collection");
        for (i = 0; i < data.elements.length; i++) {
          if (data.elements[i].name.length > 0) {
            params = data.elements[i].value;
          }
        }
        this.$emit(action, params);
        return
      }

      if (action === "add-entitlement-to-video") {
        let params =''
        const data = document.getElementById("add-entitlement-to-video");
        for (i = 0; i < data.elements.length; i++) {
          if (data.elements[i].name.length > 0) {
            params = data.elements[i].value;
          }
        }
        this.$emit(action, params);
        return
      }

      if (action === "add-custom-set") {
        let params ={
          name: '',
          attributes: []
        }
        const attributes = document.getElementsByName("addlocationset");
        const name = document.getElementsByName("setname");
        params.name = name[0].value
        for (i = 0; i < attributes.length; i++) {
          if (attributes[i].checked) {
            params.attributes.push(
              {
                id : attributes[i].id,
                value : attributes[i].value
              }
            )
          }
        }
        this.$emit(action, params);
        return
      }

      if (action === "delete-set") {
        this.$emit(action);
        return
      }

      if (action === "upload-video-file") {
        this.$emit(action);
        return
      }

      const data = document.getElementsByTagName("select");
      if (!data) {
        this.$emit(action)
      } else {
        for (i = 0; i < data.length; i++) {
          if(data[i].name === "addstore"){
            let params = {
              store: '',
              external_id: ''
            }
            if(data[i].selectedOptions.length > 0){
              params.store = data[i].selectedOptions[0].attributes[0].value

              const input = document.getElementsByTagName("input");
              for (var j = 0; j < input.length; j++) {
                if(input[j].name == "addstoreid"){
                  params.external_id = input[j].value
                }
              }
              this.$emit(action, params)
            }
          }
        }
        
      }
    },
  },
  watch: {
    "formbuilder.columns": {
      immediate: true,
      deep: true,
      handler() {
        if (this.formbuilder.reloadFormbuilder) {
          let form = {};
          this.formbuilder.columns.forEach(element => {
            form[element.field] = element.value;
          });
          this.form = form;
        }
        // document.getElementsByTagName("select").forEach(item => {
        //   item.selectedIndex = -1
        // })
      }
    }
  },
  components: {
    UploadFile,
    Multiselect
  }
};
</script>
<style>
.form-group--error input {
  border-color: #ff0101c2;
}
.help-block {
  font-size: 0.9em;
  bottom: 25%;
  right: 7%;
  position: absolute;
  color: #dc1a10;
}
.help-block span {
  padding: 10px;
}
.btn-download {
  margin-left: 20px;
}
.input-group .input-group-text {
  width: 12rem;
}
.option-hidden {
  display: none;
}
.hidden{
  display: none;
}
button:disabled {
  cursor: not-allowed;
  pointer-events: all !important;
}
.form-text-area {
  height: auto;
}
.radios .radio-item{
  margin: auto 10px;
}
.checkbox .checkbox-item{
  width: 20%;
}
.checkbox label{
  margin-left: 5px;
}
.checkbox .input-group-text {
  display: none;
}
.img-container {
  margin-top: 10px;
}
.warning {
  color: red;
}
.form-field-boxed{
  padding-left: 10px;
}
</style>
<style scoped>
.form-control.multiselect {
  padding: 0
}
.form-control::v-deep .multiselect__tags, .form-control::v-deep .multiselect__tags:focus {
  height: 100%;
  border: unset;
  outline: unset;
}
.form-control::v-deep .multiselect__input, .form-control::v-deep .multiselect__input:focus {
  border: unset;
  height: 100%;
  width: 100%;
  outline: unset;
  position: relative;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<template>
  <div class="hello">
    <p v-if="props.header">{{ props.header }}</p>
    <vue-good-table
      mode="remote"
      @on-search="searchQuery"
      @on-page-change="pageChange"
      @on-per-page-change="perpageChange"
      @on-sort-change="onSortChange"
      @on-row-click="onRowClick"
      @on-cell-click="onCellClick"
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 10,
        position: 'bottom',
        perPageDropdown: [10, 20, 50],
        rowsPerPageLabel: 'Rows per page',
        pageLabel: 'Page', // for 'pages' mode
        dropdownAllowAll: false
      }"
      :total-rows="totalRecords"
      :isLoading.sync="props.isLoading"
      :columns="columns"
      :rows="rows"
      :search-options="{
        enabled: !(props.searchname.length == 0),
        trigger: 'enter',
        skipDiacritics: true,
        placeholder: props.searchname
      }"
      :sort-options="{
        enabled: true
        //initialSortBy: { field: 'created_date', type: 'desc' }
      }"
    >

      <div slot="emptystate">No {{ props.norowsfound }} found</div>
      <template slot="table-row" slot-scope="props">
        <span
          v-if="props.column.datetype"
          @contextmenu.prevent="openMenu($event, props.row)"
        >{{ props.formattedRow[props.column.field] | formatDate }}</span>
        <span
          v-else-if="props.column.viewdatetype"
          @contextmenu.prevent="openMenu($event, props.row)"
        >{{ props.formattedRow[props.column.field] | utcDate }}</span>
        <span
          v-else-if="props.column.expirationDate"
          @contextmenu.prevent="openMenu($event, props.row)"
        >{{ props.formattedRow[props.column.field] | expirationDate }}</span>
        <span
          v-else-if="props.column.capitalize"
          class="column-capitalize"
          @contextmenu.prevent="openMenu($event, props.row)"
        >{{ props.formattedRow[props.column.field] }}</span>
        <span
          v-if="props.column.field == 'image'"
          @contextmenu.prevent="openMenu($event, props.row)"
        >
          <img :src="titleImage(props.row)" onerror="this.src='/assets/img/default_images/video.png'" :alt="props.row.attributes.title" style="width: 100px">
        </span>
        <span
          v-if="props.column.field == 'upfile'"
          @contextmenu.prevent="openMenu($event, props.row)"
        >
        <upload-file id="imageButton" button-text="Upload File" @updateFile="fileUpload" />
        </span>
        <span
          v-if="props.column.field == 'removebutton'"
          @contextmenu.prevent="openMenu($event, props.row)"
        >
          <button
            v-if="
              props.column.page == 'subscriber' 
              || props.column.page == 'video'
              || props.column.page == 'document'
              || props.column.page == 'collection'
              "
            class="btn btn-danger"
          >Delete</button>
          <button
            v-if="props.column.page == 'subscription' "
            class="btn btn-warning"
            type="button"
          >Cancel</button>
          <button
            v-if="props.column.page == 'entity' || props.column.page == 'user'"
            class="btn btn-danger"
            type="button"
          >Remove</button>
        </span>

        <span
          v-if="props.column.field == 'entitlement'"
          @contextmenu.prevent="openMenu($event, props.row)"
        >
          <span v-if="entitlements(props.row).length <= 0" class="entitlements-none">
            <span style="font-style: italic">none</span>
          </span>
          <span v-if="entitlements(props.row).length > 0">
            <span v-for="entitlement in entitlements(props.row)" :key="entitlement.id">
              <router-link :to="{name: 'EntitlementsUpdate', params: {id: entitlement.id}}" class="nav-link">
              <span>{{ entitlemenTitleById(entitlement.id) }}</span>
            </router-link>
            </span>
          </span>
          
        </span>
        <span v-else-if="props.column.field == 'downloadCsvButton'">
          <button :disabled="props.row['Status'] != 'completed'" class="btn btn-primary">Export</button>
        </span>
        <span v-else @contextmenu.prevent="openMenu($event, props.row)">
          {{
          props.formattedRow[props.column.field]
          }}
        </span>
      </template>
    </vue-good-table>
    <div class="confirmation-popup" v-if="modelOpened">
      <div class="row align-items-center no-gutters" style="padding: 15px">
        <div class="col">
          <span>Are you sure you want to delete chosen {{ props.norowsfound.toLowerCase() }}?</span>
        </div>
      </div>
      <div class="row align-items-center no-gutters">
        <div class="col">
          <button class="btn btn-success" type="button" @click="confirmDelete(params)">Yes</button>
          <button
            class="btn btn-warning btn-download"
            type="button"
            @click="confirmDelete(null)"
          >No&nbsp;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueGoodTable } from "vue-good-table";
import UploadFile from '@/components/global/UploadFile.vue'

export default {
  name: "custom-table",
  props: ["props", "reload"],
  data() {
    return {
      columns: [],
      rows: [],
      totalRecords: 0,
      serverParams: {
        columnFilters: {},
        sort: {
          field: "",
          type: ""
        },
        page: 0,
        perPage: 10,
        searchTerms: ""
      },
      modelOpened: false,
      isActive: false, 
      allEntitlements: []
    };
  },
  methods: {
    titleImage(rowObj){
      if(rowObj.attributes.images.length > 0) {
        for (let i = 0; i < rowObj.attributes.images.length; i++) {
          if (rowObj.attributes.images[i].label === 'HD') {
            return rowObj.attributes.images[i].url
          }
        }
        return rowObj.attributes.images[0].url
      }
      return ''
    },
    entitlements(rowObj) {
      return rowObj.relationships.entitlements.data
    },
    entitlemenTitleById(id) {
      for (let i = 0; i < this.allEntitlements.length; i++) {
        if (this.allEntitlements[i].id === id) {
          return this.allEntitlements[i].attributes.title
        }
      }
    },
    searchQuery(param) {
      this.serverParams.searchTerms = param.searchTerm;
      this.loadItems();
    },
    onRowClick(param) {
      console.log("On Row Click:", param);
    },
    openMenu(e) {
      console.log("Open menu Click:", e);
    },
    rowStyleClassFn(row) {
      return row;
    },
    onCellClick(params) {
      if (params.column.field == "removebutton") {
        this.params = params;
        this.modelOpened = true;
      } else {
        this.$emit("row-click", params)
        this.$emit("cell-click", params);
      }
    },
    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
    },
    pageChange(params) {
      this.updateParams({ page: (params.currentPage - 1) * params.currentPerPage });
      this.loadItems();
    },
    perpageChange(params) {
      this.updateParams({ perPage: params.currentPerPage });
      this.loadItems();
    },
    onSortChange(params) {
      this.updateParams({
        sort: [
          {
            type: params[0].type,
            field: params[0].field
          }
        ]
      });
      this.loadItems();
    },
    onColumnFilter(params) {
      this.updateParams(params);
      this.loadItems();
    },
    loadItems() {
      this.columns = this.props.columns;
      if (this.props.data != undefined) {
        this.totalRecords = this.props.data.length
        this.rows = this.props.data;
        return
      }
      if(this.props.remoteURL){
        let remoteURL;
        if (this.props.remoteParams) {
          remoteURL = this.props.remoteURL + "?" + this.props.remoteParams + "&";
        } else {
          remoteURL = this.props.remoteURL + "?";
        }

        let url =
          remoteURL +
          "offset=" +
          this.serverParams.page +
          "&limit=" +
          this.serverParams.perPage;

        if (this.serverParams.sort.length > 0) {
          url =
            url +
            "&sort_field=" +
            this.serverParams.sort[0].field +
            "&sort_type=" +
            this.serverParams.sort[0].type;
        }

        if (this.serverParams.searchTerms) {
          url = url + "&" + this.props.searchParams + "=" + this.serverParams.searchTerms;
        }
        if (this.serverParams.filterTerms) {
          url = url + "&f=" + this.serverParams.filterTerms;
        }

        if(this.props.remoteURL.includes("access-tokens")){
          url = this.props.remoteURL
        }
        console.log(url);
        //this.$axios.get(url, { body: this.serverParams }).then(response => {
        this.$axios.get(url).then(response => {
          if(response.data.meta){
            this.totalRecords = response.data.meta.total_items;
          } else {
            this.totalRecords = response.data.data.count
          }
          console.log("response", response);
          this.rows = response.data.data.rows;
          // if(this.props.page == 'view'){
          //   const filtered =[]
          //   this.rows.forEach((e) => {
          //     if(e.attributes.title.toLowerCase().includes(this.serverParams.searchTerms.toLowerCase())){
          //       filtered.push(e)
          //     }
          //   })
          //   this.rows = filtered
          // }
        });
      }
    },
    confirmDelete(params) {
      if (params != null) {
        this.$emit("cell-click", params);
        this.modelOpened = false;
      } else {
        this.modelOpened = false;
      }
    }
  },
  mounted() {
    this.loadItems();
  },
  watch: {
    reload: function(newVal, oldVal) {
      console.log("Reload CHANGED ", newVal, oldVal);
      this.loadItems();
    },
    // filter: {
    //   immediate: true,
    //   deep: true,
    //   handler() {
    //     let filterString = "";
    //     for (var key of Object.keys(this.filter)) {
    //       if (this.filter[key] != "") {
    //         if (this.filter[key]) {
    //           filterString += "+" + this.filter[key];
    //         }
    //       }
    //     }
    //     this.updateParams({ filterTerms: filterString });
    //     this.loadItems();
    //   }
    // }
  },
  created() {
    if (this.props.autoUpdate) {
      this.timer = setInterval(this.loadItems, 30000);
    }
  },
  components: {
    VueGoodTable, 
    UploadFile
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
table td {
  vertical-align: middle !important;
}
.column-capitalize {
  text-transform: capitalize;
}
.v-select {
  position: relative;
  font-family: inherit;
}

.v-select,
.v-select * {
  box-sizing: border-box;
}

@-webkit-keyframes vSelectSpinner {
  0% {
    transform: rotate(0);
  }
  to {
    transform: rotate(1turn);
  }
}

@keyframes vSelectSpinner {
  0% {
    transform: rotate(0);
  }
  to {
    transform: rotate(1turn);
  }
}

.vs__fade-enter-active,
.vs__fade-leave-active {
  transition: opacity 0.15s cubic-bezier(1, 0.5, 0.8, 1);
}

.vs__fade-enter,
.vs__fade-leave-to {
  opacity: 0;
}

.vs--disabled .vs__clear,
.vs--disabled .vs__dropdown-toggle,
.vs--disabled .vs__open-indicator,
.vs--disabled .vs__search,
.vs--disabled .vs__selected {
  cursor: not-allowed;
  background-color: #f8f8f8;
}

.v-select[dir="rtl"] .vs__actions {
  padding: 0 3px 0 6px;
}

.v-select[dir="rtl"] .vs__clear {
  margin-left: 6px;
  margin-right: 0;
}

.v-select[dir="rtl"] .vs__deselect {
  margin-left: 0;
  margin-right: 2px;
}

.v-select[dir="rtl"] .vs__dropdown-menu {
  text-align: right;
}

.vs__dropdown-toggle {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: flex;
  padding: 0 0 4px;
  background: 0 0;
  border: 1px solid rgba(60, 60, 60, 0.26);
  border-radius: 4px;
  white-space: normal;
}

.vs__selected-options {
  display: flex;
  flex-basis: 100%;
  flex-grow: 1;
  flex-wrap: wrap;
  padding: 0 2px;
  position: relative;
}

.vs__actions {
  display: flex;
  align-items: center;
  padding: 4px 6px 0 3px;
}

.vs--searchable .vs__dropdown-toggle {
  cursor: text;
}

.vs--unsearchable .vs__dropdown-toggle {
  cursor: pointer;
}

.vs--open .vs__dropdown-toggle {
  border-bottom-color: transparent;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.vs__open-indicator {
  fill: rgba(60, 60, 60, 0.5);
  transform: scale(1);
  transition: transform 0.15s cubic-bezier(1, -0.115, 0.975, 0.855);
  transition-timing-function: cubic-bezier(1, -0.115, 0.975, 0.855);
}

.vs--open .vs__open-indicator {
  transform: rotate(180deg) scale(1);
}

.vs--loading .vs__open-indicator {
  opacity: 0;
}

.vs__clear {
  fill: rgba(60, 60, 60, 0.5);
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  margin-right: 8px;
}

.vs__dropdown-menu {
  display: block;
  position: absolute;
  top: calc(100% - 1px);
  left: 0;
  z-index: 1000;
  padding: 5px 0;
  margin: 0;
  width: 100%;
  max-height: 350px;
  min-width: 160px;
  overflow-y: auto;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(60, 60, 60, 0.26);
  border-top-style: none;
  border-radius: 0 0 4px 4px;
  text-align: left;
  list-style: none;
  background: #fff;
}

.vs__no-options {
  text-align: center;
}

.vs__dropdown-option {
  line-height: 1.42857143;
  display: block;
  padding: 3px 20px;
  clear: both;
  color: #333;
  white-space: nowrap;
}

.vs__dropdown-option:hover {
  cursor: pointer;
}

.vs__dropdown-option--highlight {
  background: #5897fb;
  color: #fff;
}

.vs__dropdown-option--disabled {
  background: inherit;
  color: rgba(60, 60, 60, 0.5);
}

.vs__dropdown-option--disabled:hover {
  cursor: inherit;
}

.vs__selected {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid rgba(60, 60, 60, 0.26);
  border-radius: 4px;
  color: #333;
  line-height: 1.4;
  margin: 4px 2px 0;
  padding: 0 0.25em;
}

.vs__deselect {
  display: inline-flex;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin-left: 4px;
  padding: 0;
  border: 0;
  cursor: pointer;
  background: 0 0;
  fill: rgba(60, 60, 60, 0.5);
  text-shadow: 0 1px 0 #fff;
}

.vs--single .vs__selected {
  background-color: transparent;
  border-color: transparent;
}

.vs--single.vs--open .vs__selected {
  position: absolute;
  opacity: 0.4;
}

.vs--single.vs--searching .vs__selected {
  display: none;
}

.vs__search::-webkit-search-cancel-button {
  display: none;
}

.vs__search::-ms-clear,
.vs__search::-webkit-search-decoration,
.vs__search::-webkit-search-results-button,
.vs__search::-webkit-search-results-decoration {
  display: none;
}

.vs__search,
.vs__search:focus {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  line-height: 1.4;
  font-size: 1em;
  border: 1px solid transparent;
  border-left: none;
  outline: 0;
  margin: 4px 0 0;
  padding: 0 7px;
  background: 0 0;
  box-shadow: none;
  width: 0;
  max-width: 100%;
  flex-grow: 1;
}

.vs__search::-webkit-input-placeholder {
  color: inherit;
}

.vs__search::-moz-placeholder {
  color: inherit;
}

.vs__search:-ms-input-placeholder {
  color: inherit;
}

.vs__search::-ms-input-placeholder {
  color: inherit;
}

.vs__search::placeholder {
  color: inherit;
}

.vs--unsearchable .vs__search {
  opacity: 1;
}

.vs--unsearchable .vs__search:hover {
  cursor: pointer;
}

.vs--single.vs--searching:not(.vs--open):not(.vs--loading) .vs__search {
  opacity: 0.2;
}

.vs__spinner {
  align-self: center;
  opacity: 0;
  font-size: 5px;
  text-indent: -9999em;
  overflow: hidden;
  border: 0.9em solid hsla(0, 0%, 39.2%, 0.1);
  border-left-color: rgba(60, 60, 60, 0.45);
  transform: translateZ(0);
  -webkit-animation: vSelectSpinner 1.1s linear infinite;
  animation: vSelectSpinner 1.1s linear infinite;
  transition: opacity 0.1s;
}

.vs__spinner,
.vs__spinner:after {
  border-radius: 50%;
  width: 5em;
  height: 5em;
}

.vs--loading .vs__spinner {
  opacity: 1;
}

.vgt-right-align {
  text-align: right;
}

.vgt-left-align {
  text-align: left;
}

.vgt-center-align {
  text-align: center;
}

.vgt-pull-left {
  float: left !important;
}

.vgt-pull-right {
  float: right !important;
}

.vgt-clearfix::after {
  display: block;
  content: "";
  clear: both;
}

.vgt-responsive {
  width: 100%;
  overflow-x: auto;
  position: relative;
}

.vgt-text-disabled {
  color: #909399;
}

.vgt-wrap {
  position: relative;
}

.vgt-fixed-header {
  position: absolute;
  z-index: 10;
  width: 100%;
  overflow-x: auto;
}

table.vgt-table {
  font-size: 16px;
  border-collapse: collapse;
  background-color: #fff;
  width: 100%;
  max-width: 100%;
  table-layout: auto;
  border: 1px solid #dcdfe6;
}

table.vgt-table td {
  padding: 0.75em 0.75em 0.75em 0.75em;
  vertical-align: top;
  border-bottom: 1px solid #dcdfe6;
  color: #606266;
}

table.vgt-table tr.clickable {
  cursor: pointer;
}

table.vgt-table tr.clickable:hover {
  background-color: #f1f5fd;
}

.vgt-table th {
  padding: 0.75em 1.5em 0.75em 0.75em;
  vertical-align: middle;
  position: relative;
}

.vgt-table th.sortable {
  cursor: pointer;
}

.vgt-table th.sortable:after {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  right: 6px;
  top: 50%;
  margin-top: -7px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid #cfd3e0;
}

.vgt-table th.sortable:before {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  right: 6px;
  top: 50%;
  margin-bottom: -7px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #cfd3e0;
}

.vgt-table th.line-numbers,
.vgt-table th.vgt-checkbox-col {
  padding: 0 0.75em 0 0.75em;
  color: #606266;
  border-right: 1px solid #dcdfe6;
  word-wrap: break-word;
  width: 25px;
  text-align: center;
  background: linear-gradient(#f4f5f8, #f1f3f6);
}

.vgt-table th.filter-th {
  padding: 0.75em 0.75em 0.75em 0.75em;
}

.vgt-table th.vgt-row-header {
  border-bottom: 2px solid #dcdfe6;
  border-top: 2px solid #dcdfe6;
  background-color: #fafafb;
}

.vgt-table th.vgt-row-header .triangle {
  width: 24px;
  height: 24px;
  border-radius: 15%;
  position: relative;
  margin: 0 8px;
}

.vgt-table th.vgt-row-header .triangle:after {
  content: "";
  position: absolute;
  display: block;
  left: 50%;
  top: 50%;
  margin-top: -6px;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid #606266;
  margin-left: -3px;
  transition: 0.3s ease transform;
}

.vgt-table th.vgt-row-header .triangle.expand:after {
  transform: rotate(90deg);
}

.vgt-table thead th {
  color: #606266;
  vertical-align: bottom;
  border-bottom: 2px solid #e3e6f0;
  padding-right: 1.5em;
  background: white;
}

.vgt-table thead th.vgt-checkbox-col {
  vertical-align: middle;
}

.vgt-table thead th.sorting-asc:after {
  border-bottom: 5px solid #409eff;
}

.vgt-table thead th.sorting-desc:before {
  border-top: 5px solid #409eff;
}

.vgt-input,
.vgt-select {
  width: 100%;
  height: 32px;
  line-height: 1;
  display: block;
  font-size: 14px;
  font-weight: 400;
  padding: 6px 12px;
  color: #606266;
  border-radius: 4px;
  box-sizing: border-box;
  background-image: none;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.vgt-input::placeholder,
.vgt-select::placeholder {
  color: #606266;
  opacity: 0.3;
}

.vgt-input:focus,
.vgt-select:focus {
  outline: 0;
  border-color: #409eff;
}

.v-select {
  border-radius: 4px;
  color: #606266;
}

.v-select::placeholder {
  color: #606266;
  opacity: 0.3;
}

.v-select:focus {
  outline: 0;
  border-color: #409eff;
}

.v-select input {
  color: #606266;
}

.v-select .vs__open-indicator {
  fill: #606266;
}

.vgt-loading {
  position: absolute;
  width: 100%;
  z-index: 10;
  margin-top: 117px;
}

.vgt-loading__content {
  background-color: #c0dfff;
  color: #409eff;
  padding: 7px 30px;
  border-radius: 3px;
}

.vgt-inner-wrap.is-loading {
  opacity: 0.5;
  pointer-events: none;
}

.vgt-table.bordered td,
.vgt-table.bordered th {
  border: 1px solid #dcdfe6;
}

.vgt-table.bordered th.vgt-row-header {
  border-bottom: 3px solid #dcdfe6;
}

.vgt-table.striped tbody tr:nth-of-type(odd) {
  background-color: rgba(51, 68, 109, 0.03);
}

.vgt-wrap.rtl {
  direction: rtl;
}

.vgt-wrap.rtl .vgt-table td,
.vgt-wrap.rtl .vgt-table th:not(.line-numbers) {
  padding: 0.75em 0.75em 0.75em 1.5em;
}

.vgt-wrap.rtl .vgt-table thead th,
.vgt-wrap.rtl .vgt-table.condensed thead th {
  padding-left: 1.5em;
  padding-right: 0.75em;
}

.vgt-wrap.rtl .vgt-table th.sorting-asc:after,
.vgt-wrap.rtl .vgt-table th.sorting:after {
  margin-right: 5px;
  margin-left: 0;
}

.vgt-table.condensed td,
.vgt-table.condensed th.vgt-row-header {
  padding: 0.4em 0.4em 0.4em 0.4em;
}

.vgt-global-search {
  padding: 5px 0;
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  border: 1px solid #dcdfe6;
  border-bottom: 0;
  background: linear-gradient(#f4f5f8, #f1f3f6);
}

.vgt-global-search__input {
  position: relative;
  padding-left: 40px;
  flex-grow: 1;
}

.vgt-global-search__input .input__icon {
  position: absolute;
  left: 0;
  max-width: 32px;
}

.vgt-global-search__input .input__icon .magnifying-glass {
  margin-top: 3px;
  margin-left: 8px;
  display: block;
  width: 16px;
  height: 16px;
  border: 2px solid #d6dae2;
  position: relative;
  border-radius: 50%;
}

.vgt-global-search__input .input__icon .magnifying-glass:before {
  content: "";
  display: block;
  position: absolute;
  right: -7px;
  bottom: -5px;
  background: #d6dae2;
  width: 8px;
  height: 4px;
  border-radius: 2px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
}

.vgt-global-search__actions {
  margin-left: 10px;
}

.vgt-selection-info-row {
  background: #fdf9e8;
  padding: 5px 16px;
  font-size: 13px;
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  color: #d3aa3b;
  font-weight: 700;
}

.vgt-selection-info-row a {
  font-weight: 700;
  display: inline-block;
  margin-left: 10px;
}

.vgt-wrap__actions-footer {
  border: 1px solid #dcdfe6;
}

.vgt-wrap__footer {
  color: #606266;
  padding: 1em;
  border: 1px solid #dcdfe6;
  background: white;
}

.vgt-wrap__footer .footer__row-count__label,
.vgt-wrap__footer .footer__row-count__select {
  display: inline-block;
  vertical-align: middle;
}

.vgt-wrap__footer .footer__row-count__label {
  font-size: 14px;
  color: #909399;
}

.vgt-wrap__footer .footer__row-count__select {
  background-color: transparent;
  width: auto;
  padding: 0;
  border: 0;
  border-radius: 0;
  height: auto;
  font-size: 14px;
  margin-left: 8px;
  color: #606266;
  font-weight: 700;
}

.vgt-wrap__footer .footer__row-count__select:focus {
  outline: 0;
  border-color: #409eff;
}

.vgt-wrap__footer .footer__navigation {
  font-size: 14px;
}

.vgt-wrap__footer .footer__navigation__info,
.vgt-wrap__footer .footer__navigation__page-btn,
.vgt-wrap__footer .footer__navigation__page-info {
  display: inline-block;
  vertical-align: middle;
}

.vgt-wrap__footer .footer__navigation__page-btn {
  text-decoration: none;
  color: #606266;
  font-weight: 700;
  white-space: nowrap;
}

.vgt-wrap__footer .footer__navigation__page-btn:focus {
  outline: 0;
  border: 0;
}

.vgt-wrap__footer .footer__navigation__page-btn.disabled,
.vgt-wrap__footer .footer__navigation__page-btn.disabled:hover {
  opacity: 0.5;
  cursor: not-allowed;
}

.vgt-wrap__footer .footer__navigation__page-btn.disabled .chevron.left:after,
.vgt-wrap__footer
  .footer__navigation__page-btn.disabled:hover
  .chevron.left:after {
  border-right-color: #606266;
}

.vgt-wrap__footer .footer__navigation__page-btn.disabled .chevron.right:after,
.vgt-wrap__footer
  .footer__navigation__page-btn.disabled:hover
  .chevron.right:after {
  border-left-color: #606266;
}

.vgt-wrap__footer .footer__navigation__page-btn .chevron {
  width: 24px;
  height: 24px;
  border-radius: 15%;
  position: relative;
  margin: 0 8px;
}

.vgt-wrap__footer .footer__navigation__page-btn .chevron:after {
  content: "";
  position: absolute;
  display: block;
  left: 50%;
  top: 50%;
  margin-top: -6px;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.vgt-wrap__footer .footer__navigation__page-btn .chevron.left::after {
  border-right: 6px solid #409eff;
  margin-left: -3px;
}

.vgt-wrap__footer .footer__navigation__page-btn .chevron.right::after {
  border-left: 6px solid #409eff;
  margin-left: -3px;
}

.vgt-wrap__footer .footer__navigation__info,
.vgt-wrap__footer .footer__navigation__page-info {
  display: inline-block;
  color: #909399;
  margin: 0 16px;
}

.vgt-wrap__footer .footer__navigation__page-info__current-entry {
  width: 30px;
  text-align: center;
  display: inline-block;
  margin: 0 10px;
  font-weight: 700;
}

@media only screen and (max-width: 750px) {
  .vgt-wrap__footer .footer__navigation__info {
    display: none;
  }
  .vgt-wrap__footer .footer__navigation__page-btn {
    margin-left: 16px;
  }
}

.vgt-table.nocturnal {
  border: 1px solid #435169;
  background-color: #324057;
}

.vgt-table.nocturnal tr.clickable:hover {
  background-color: #445168;
}

.vgt-table.nocturnal td {
  border-bottom: 1px solid #435169;
  color: #c7ced8;
}

.vgt-table.nocturnal th.line-numbers,
.vgt-table.nocturnal th.vgt-checkbox-col {
  color: #c7ced8;
  border-right: 1px solid #435169;
  background: linear-gradient(#2c394f, #2c394f);
}

.vgt-table.nocturnal thead th {
  color: #c7ced8;
  border-bottom: 1px solid #435169;
  background: linear-gradient(#2c394f, #2c394f);
}

.vgt-table.nocturnal thead th.sortable:before {
  border-top-color: #3e5170;
}

.vgt-table.nocturnal thead th.sortable:after {
  border-bottom-color: #3e5170;
}

.vgt-table.nocturnal thead th.sortable.sorting-asc {
  color: #fff;
}

.vgt-table.nocturnal thead th.sortable.sorting-asc:after {
  border-bottom-color: #409eff;
}

.vgt-table.nocturnal thead th.sortable.sorting-desc {
  color: #fff;
}

.vgt-table.nocturnal thead th.sortable.sorting-desc:before {
  border-top-color: #409eff;
}

.vgt-table.nocturnal.bordered td,
.vgt-table.nocturnal.bordered th {
  border: 1px solid #435169;
}

.vgt-table.nocturnal .vgt-input,
.vgt-table.nocturnal .vgt-select {
  color: #c7ced8;
  background-color: #232d3f;
  border: 1px solid #435169;
}

.vgt-table.nocturnal .vgt-input::placeholder,
.vgt-table.nocturnal .vgt-select::placeholder {
  color: #c7ced8;
  opacity: 0.3;
}

.vgt-table.nocturnal .v-select {
  background-color: #232d3f;
}

.vgt-table.nocturnal .v-select input {
  color: #c7ced8;
}

.vgt-table.nocturnal .v-select .vs__open-indicator {
  fill: #c7ced8;
}

.vgt-wrap.nocturnal .vgt-wrap__footer {
  color: #c7ced8;
  border: 1px solid #435169;
  background: linear-gradient(#2c394f, #2c394f);
}

.vgt-wrap.nocturnal .vgt-wrap__footer .footer__row-count__label {
  color: #8290a7;
}

.vgt-wrap.nocturnal .vgt-wrap__footer .footer__row-count__select {
  color: #c7ced8;
}

.vgt-wrap.nocturnal .vgt-wrap__footer .footer__row-count__select:focus {
  border-color: #409eff;
}

.vgt-wrap.nocturnal .vgt-wrap__footer .footer__navigation__page-btn {
  color: #c7ced8;
}

.vgt-wrap.nocturnal
  .vgt-wrap__footer
  .footer__navigation__page-btn.disabled
  .chevron.left:after,
.vgt-wrap.nocturnal
  .vgt-wrap__footer
  .footer__navigation__page-btn.disabled:hover
  .chevron.left:after {
  border-right-color: #c7ced8;
}

.vgt-wrap.nocturnal
  .vgt-wrap__footer
  .footer__navigation__page-btn.disabled
  .chevron.right:after,
.vgt-wrap.nocturnal
  .vgt-wrap__footer
  .footer__navigation__page-btn.disabled:hover
  .chevron.right:after {
  border-left-color: #c7ced8;
}

.vgt-wrap.nocturnal .vgt-wrap__footer .footer__navigation__info,
.vgt-wrap.nocturnal .vgt-wrap__footer .footer__navigation__page-info {
  color: #8290a7;
}

.vgt-wrap.nocturnal .vgt-global-search {
  border: 1px solid #435169;
  background: linear-gradient(#2c394f, #2c394f);
}

.vgt-wrap.nocturnal .vgt-global-search__input .input__icon .magnifying-glass {
  border: 2px solid #3f4c63;
}

.vgt-wrap.nocturnal
  .vgt-global-search__input
  .input__icon
  .magnifying-glass:before {
  background: #3f4c63;
}

.vgt-wrap.nocturnal .vgt-global-search__input .vgt-input,
.vgt-wrap.nocturnal .vgt-global-search__input .vgt-select {
  color: #c7ced8;
  background-color: #232d3f;
  border: 1px solid #435169;
}

.vgt-wrap.nocturnal .vgt-global-search__input .vgt-input::placeholder,
.vgt-wrap.nocturnal .vgt-global-search__input .vgt-select::placeholder {
  color: #c7ced8;
  opacity: 0.3;
}

.vgt-table.black-rhino {
  border: 1px solid #435169;
  background-color: #dfe5ee;
}

.vgt-table.black-rhino tr.clickable:hover {
  background-color: #fff;
}

.vgt-table.black-rhino td {
  border-bottom: 1px solid #bbc5d6;
  color: #49515e;
}

.vgt-table.black-rhino th.line-numbers,
.vgt-table.black-rhino th.vgt-checkbox-col {
  color: #dae2f0;
  border-right: 1px solid #435169;
  background: linear-gradient(#4c5c79, #4e5d7c);
}

.vgt-table.black-rhino thead th {
  color: #dae2f0;
  text-shadow: 1px 1px #3e5170;
  border-bottom: 1px solid #435169;
  background: linear-gradient(#4c5c79, #4e5d7c);
}

.vgt-table.black-rhino thead th.sortable:before {
  border-top-color: #607498;
}

.vgt-table.black-rhino thead th.sortable:after {
  border-bottom-color: #607498;
}

.vgt-table.black-rhino thead th.sortable.sorting-asc {
  color: #fff;
}

.vgt-table.black-rhino thead th.sortable.sorting-asc:after {
  border-bottom-color: #409eff;
}

.vgt-table.black-rhino thead th.sortable.sorting-desc:before {
  border-top-color: #409eff;
}

.vgt-table.black-rhino.bordered td {
  border: 1px solid #bbc5d6;
}

.vgt-table.black-rhino.bordered th {
  border: 1px solid #435169;
}

.vgt-table.black-rhino .vgt-input,
.vgt-table.black-rhino .vgt-select {
  color: #dae2f0;
  background-color: #34445f;
  border: 1px solid transparent;
}

.vgt-table.black-rhino .vgt-input::placeholder,
.vgt-table.black-rhino .vgt-select::placeholder {
  color: #dae2f0;
  opacity: 0.3;
}

.vgt-table.black-rhino .v-select {
  background-color: #34445f;
}

.vgt-table.black-rhino .v-select input {
  color: #dae2f0;
}

.vgt-table.black-rhino .v-select .vs__open-indicator {
  fill: #dae2f0;
}

.vgt-wrap.black-rhino .vgt-wrap__footer {
  color: #dae2f0;
  border: 1px solid #435169;
  background: linear-gradient(#4c5c79, #4e5d7c);
}

.vgt-wrap.black-rhino .vgt-wrap__footer .footer__row-count {
  position: relative;
  padding-right: 3px;
}

.vgt-wrap.black-rhino .vgt-wrap__footer .footer__row-count__label {
  color: #98a5b9;
}

.vgt-wrap.black-rhino .vgt-wrap__footer .footer__row-count__select {
  color: #49515e;
  background: #dfe5ee;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding-right: 15px;
  padding-left: 5px;
  border-radius: 3px;
}

.vgt-wrap.black-rhino .vgt-wrap__footer .footer__row-count__select::-ms-expand {
  display: none;
}

.vgt-wrap.black-rhino .vgt-wrap__footer .footer__row-count__select:focus {
  border-color: #409eff;
}

.vgt-wrap.black-rhino .vgt-wrap__footer .footer__row-count::after {
  content: "";
  display: block;
  position: absolute;
  height: 0;
  width: 0;
  right: 6px;
  top: 50%;
  margin-top: -1px;
  border-top: 6px solid #49515e;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: none;
  pointer-events: none;
}

.vgt-wrap.black-rhino .vgt-wrap__footer .footer__navigation__page-btn {
  color: #dae2f0;
}

.vgt-wrap.black-rhino
  .vgt-wrap__footer
  .footer__navigation__page-btn.disabled
  .chevron.left:after,
.vgt-wrap.black-rhino
  .vgt-wrap__footer
  .footer__navigation__page-btn.disabled:hover
  .chevron.left:after {
  border-right-color: #dae2f0;
}

.vgt-wrap.black-rhino
  .vgt-wrap__footer
  .footer__navigation__page-btn.disabled
  .chevron.right:after,
.vgt-wrap.black-rhino
  .vgt-wrap__footer
  .footer__navigation__page-btn.disabled:hover
  .chevron.right:after {
  border-left-color: #dae2f0;
}

.vgt-wrap.black-rhino .vgt-wrap__footer .footer__navigation__info,
.vgt-wrap.black-rhino .vgt-wrap__footer .footer__navigation__page-info {
  color: #dae2f0;
}

.vgt-wrap.black-rhino .vgt-global-search {
  border: 1px solid #435169;
  background: linear-gradient(#4c5c79, #4e5d7c);
}

.vgt-wrap.black-rhino .vgt-global-search__input .input__icon .magnifying-glass {
  border: 2px solid #3f4c63;
}

.vgt-wrap.black-rhino
  .vgt-global-search__input
  .input__icon
  .magnifying-glass:before {
  background: #3f4c63;
}

.vgt-wrap.black-rhino .vgt-global-search__input .vgt-input,
.vgt-wrap.black-rhino .vgt-global-search__input .vgt-select {
  color: #dae2f0;
  background-color: #44516c;
  border: 1px solid transparent;
}

.vgt-wrap.black-rhino .vgt-global-search__input .vgt-input::placeholder,
.vgt-wrap.black-rhino .vgt-global-search__input .vgt-select::placeholder {
  color: #dae2f0;
  opacity: 0.3;
}
.confirmation-popup {
  height: 150px;
  width: 500px;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15) !important;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 9px;
  text-align: center;
  padding: 20px;
  z-index: 9999;
}
</style>

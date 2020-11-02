<template>
  <div>
    <div class="form-group top-control-container">
      <button class="btn btn-primary" @click="createDocument">Create New Document</button>
    </div>
    <custom-table :props="props" @cell-click="cellClick" :reload="reload"></custom-table>
  </div>
</template>

<script>
export default {
  name: "Documents",
  data() {
    return {
      props: {
        columns: [
          {
            label: "Title",
            field: "attributes.title",
            filterable: true,
            sortable: false,
          },
          {
            label: "Label",
            field: "attributes.label",
            filterable: true,
            sortable: false,
          },
          {
            label: "",
            field: "removebutton",
            sortable: false,
            page: "document"
          }
        ],
        norowsfound: "document",
        searchname: "Search for a video by title...",
        remoteURL: this.$settings.baseURL + "/properties/" + this.$settings.propertyID + "/documents",
        isLoading: false,
        searchParams: 'title'
      },
      reload: false, 
    };
  },
  methods: {
    async cellClick(params) {
      if (params.column.field == "removebutton") {
        var response = await this.$api.documents.delete(params.row.id);
        if (response.status == 204) {
          this.$toasted.success("Document Deleted");
          this.reload = !this.reload;
        } else {
          this.$toasted.error(response.message);
        }
      } else {
        this.$router.push({ name: "DocumentsUpdate", params: params.row });
      }
    },
    createDocument() { 
      this.$router.push({ name: "DocumentsCreate" });
    }
  }
};
</script>
<style>
.top-control-container {
  display: flex;
  justify-content: space-between;
  margin: 0 20px 16px;
}
.input-checkbox-container {
  align-items: center;
  background-color: #eaecf4;
  border: 1px solid #d1d3e2;
}
.checkbox-large:focus {
  outline: unset;
}
.top-right-control-container {
  float: right;
  width: unset !important;
}
.top-right-control-container .form-control {
  width: unset !important;
}
.checkbox-large {
  transform: scale(2);
  -ms-transform: scale(2);
  -webkit-transform: scale(2);
  padding: 10px;
}
.form-group-label {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #6e707e;
  text-align: center;
  white-space: nowrap;
  margin: 0 10px 0 30px;
}
</style>

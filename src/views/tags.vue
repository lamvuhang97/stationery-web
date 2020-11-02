<template>
  <div>
    <div class="form-group top-control-container">
      <button class="btn btn-primary" @click="createShowTag">Create New Show Tag</button>
    </div>
    <custom-table :props="props.show" @cell-click="cellClick" :reload="props.show.reload"></custom-table>
    <br/>
    <br/>
    <br/>
    <div class="form-group top-control-container">
      <button class="btn btn-primary" @click="createOtherTag">Create New Tag</button>
    </div>
    <custom-table :props="props.other" @cell-click="cellClick" :reload="props.other.reload"></custom-table>
  </div>
</template>

<script>

export default {
  name: "Tags",
  data() {
    return {
      props: {
        show: {
          columns: [
            {
              label: "Name",
              field: "attributes.name",
              filterable: true,
              sortable: false,
            },
            {
              label: "Tag Type",
              field: "attributes.tag_type",
              filterable: false,
              sortable: false
            },
            {
              label: "",
              field: "removebutton",
              sortable: false,
              page: "subscriber"
            }
          ],
          norowsfound: "tag",
          searchname: "Search",
          remoteParams: "type=show",
          remoteURL: this.$settings.baseURL + "/properties/" + this.$settings.propertyID + "/tags",
          isLoading: false,
          reload: false,
        },
        other: {
          columns: [
            {
              label: "Name",
              field: "attributes.name",
              filterable: true,
              sortable: false,
            },
            {
              label: "Tag Type",
              field: "attributes.tag_type",
              filterable: false,
              sortable: false
            },
            {
              label: "",
              field: "removebutton",
              sortable: false,
              page: "subscriber"
            }
          ],
          norowsfound: "tag",
          searchname: "Search",
          remoteParams: "type=other",
          remoteURL: this.$settings.baseURL + "/properties/" + this.$settings.propertyID + "/tags",
          isLoading: false,
          reload: false,
        },
      }
    };
  },
  methods: {
    async cellClick(params) {
      if (params.column.field == "removebutton") {
        var response = await this.$api.tags.delete(params.row.id);
        if (response.status == 204) {
          this.$toasted.success("Tag Deleted");
          this.props[params.row.attributes.tag_type].reload = !this.props[params.row.attributes.tag_type].reload
        } else {
          this.$toasted.error(response.message);
        }
      } else {
        this.$router.push({ name: "TagUpdate", params: params.row });
      }
    },
    createShowTag() {
      this.$router.push({ name: "TagCreate", params: {type: "show"} });
    },
    createOtherTag() {
      this.$router.push({ name: "TagCreate", params: {type: "other"} });
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

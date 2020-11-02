<template>
  <span>
    <div class="form-group">
      <span class="input-group-text">{{ group.label }}</span>
      <select class="form-control" :name="group.field">
        <option
          v-for="option in item.options"
          :value="option.value"
          :key="option.label"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <div v-for="item in data" :key="item.field">
      <div class="form-group">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">{{ item.label }}</span>
          </div>
          <input
            class="form-control"
            type="text"
            :readonly="item.readonly"
            :name="item.field"
            :placeholder="item.placeholder"
            :value="item.value"
            :forcenumber="item.forcenumber"
          />
          <div class="input-group-append"></div>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
export default {
  name: "form-grouping",
  props: {
    data: {
      type: Array,
      required: true
    },
    group: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      columns: []
    };
  },
  methods: {}
};
</script>

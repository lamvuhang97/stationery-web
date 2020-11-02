<template>
  <div class="tag">
    <span class="tag-text">
      {{ locationItem.name }}
    </span>
    <a v-if="allowRemoval" tabindex="0" @click.stop.prevent="removeMe" @keypress.enter="removeMe">
      <font-awesome-icon class="delete-icon" :icon="['fas', 'minus-circle']" />
    </a>
  </div>
</template>

<script>
import Location from '../../models/location/location'

export default {
  name: 'LocationTag',
  props: {
    locationItem: {
      type: Location,
      default() {
        return { id: '', name: '', county_code: '' }
      },
    },
    allowRemoval: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    removeMe() {
      this.$emit('remove-me', this.locationItem)
    },
  },
}
</script>
<style>
.tag {
  border-color: #ddd;
  border-style: solid;
  border-width: 1.2px;
}
.tag-text {
  margin-right: 5px;
  text-decoration: none;
}
.tag a {
  border-bottom: none;
}
</style>

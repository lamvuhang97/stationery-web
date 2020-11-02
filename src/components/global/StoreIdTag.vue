<template>
  <div class="tag">
    <span class="tag-text"> {{ storeIdItem.store }} : {{ storeIdItem.external_id }} </span>
    <a v-if="allowRemoval" class="clickable" tabindex="0" @click.stop.prevent="removeMe" @keypress.enter="removeMe">
      <font-awesome-icon class="delete-icon" :icon="['fas', 'minus-circle']" />
    </a>
  </div>
</template>

<script>
export default {
  name: 'StoreIdTag',
  props: {
    storeIdItem: {
      type: Object,
      default() {
        return { store: '', external_id: '' }
      },
    },
    allowRemoval: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    removeMe() {
      this.$emit('remove-me', this.storeIdItem)
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
.clickable {
  cursor: pointer;
}
</style>

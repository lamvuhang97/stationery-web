<template>
  <div class="tag">
    <span class="tag-text"> {{ entitlementItem.title }} </span>
    <a v-if="allowRemoval" tabindex="0" @click.stop.prevent="removeMe" @keypress.enter="removeMe">
      <font-awesome-icon class="delete-icon" :icon="['fas', 'minus-circle']" />
    </a>
  </div>
</template>

<script>
import Entitlement from '../../models/entitlement/entitlement'

export default {
  name: 'EntitlementTag',
  props: {
    entitlementItem: {
      type: Entitlement,
      default() {
        return { title: '', description: '', external_product_ids: [] }
      },
    },
    allowRemoval: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    removeMe() {
      this.$emit('remove-me', this.entitlementItem)
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

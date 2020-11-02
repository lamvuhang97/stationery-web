<template>
  <div slot="option" slot-scope="props" class="multiselect-option">
    <span class="icon">
      <font-awesome-icon v-if="props.option.entity_type === 'collection'" :icon="['fas', 'layer-group']" />
      <font-awesome-icon v-if="props.option.entity_type === 'video'" :icon="['fas', 'video']" />
    </span>
    {{ props.option.title }}
    <br />
    {{ props.option.description }}
  </div>
</template>

<script>
export default {
  name: 'EntitySelectionLabel',
}
</script>

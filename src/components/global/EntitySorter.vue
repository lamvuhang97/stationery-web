<template>
  <div>
    <div
      v-if="myEntities.length > 0"
      v-sortable="{
        onUpdate: onListUpdate,
        selectedClass: 'selected',
      }"
      class="entitiesAdded"
    >
      <div
        v-for="(item, idx) in myEntities"
        :id="idx + item.id"
        :ref="item.id + idx"
        :key="idx + item.id"
        :title="item.id"
      >
        <component
          :is="componentType(item.type)"
          :show-check-box="false"
          :data="dataById(item)"
          :show-up-and-down="showUpAndDown"
          :show-edit="showEdit"
          :show-remove="showRemove"
          :allow-detail-view="allowDetailView"
          @up="moveUp(idx)"
          @down="moveDown(idx)"
          @remove="remove(idx, true)"
        >
        </component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Entity, EntityType } from '@/models/entity'
import VideoCard from '@/components/video/VideoCard.vue'
import CollectionCard from '@/components/collection/CollectionCard.vue'
import RoleCard from '@/components/user/RoleCard.vue'

// EntitySorter handles sortingomponent cards
// show-remove Boolean - enable or disable showing remove button on component cards
// show-up-and-down Boolean - enable or disable showing up and down buttons entity lists via click and drag as well as buttons.
// Props:
// entities - A list of Entity type objects to sort
// show-edit Boolean - enable or disable showing edit button on c
// Emits:
// entities-updated - with the list of entites when it's changed
export default Vue.extend({
  name: 'EntitySorter',
  components: {
    VideoCard,
    RoleCard,
    CollectionCard,
  },
  props: {
    entities: {
      type: Array,
      default: () => [],
    },
    showEdit: {
      type: Boolean,
      default: () => false,
    },
    showUpAndDown: {
      type: Boolean,
      default: () => true,
    },
    showRemove: {
      type: Boolean,
      default: () => true,
    },
    allowDetailView: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      myEntities: [],
    } as {
      myEntities: Entity[]
    }
  },
  computed: {
    allCollections() {
      return this.$store.state.collections.collectionData
    },
    allVideos() {
      return this.$store.state.videos.videoData
    },
  },
  watch: {
    entities() {
      this.myEntities = [...this.entities]
    },
  },
  mounted() {
    this.myEntities = [...this.entities]
  },
  methods: {
    onListUpdate(event) {
      if (event.oldIndicies.length === 0) {
        const rem = this.myEntities.splice(event.oldIndex, 1)[0]
        this.myEntities.splice(event.newIndex, 0, rem)
      } else {
        for (let i = 0; i < event.oldIndicies.length; i++) {
          const rem = this.myEntities.splice(event.oldIndicies[i].index, 1)[0]
          this.myEntities.splice(event.newIndicies[i].index, 0, rem)
        }
      }
      this.$emit('entities-updated', this.myEntities)
    },
    componentType(type: string) {
      if (type === EntityType.VIDEO) {
        return 'VideoCard'
      } else if (type === EntityType.COLLECTION) {
        return 'CollectionCard'
      } else {
        return 'RoleCard'
      }
    },
    dataById(item: Entity) {
      const type = item.type
      const id = item.id
      if (type === EntityType.VIDEO) {
        for (let i = 0; i < this.allVideos.length; i++) {
          if (this.allVideos[i].id === id) {
            return this.allVideos[i]
          }
        }
        return undefined
      } else if (type === EntityType.COLLECTION) {
        for (let i = 0; i < this.allCollections.length; i++) {
          if (this.allCollections[i].id === id) {
            return this.allCollections[i]
          }
        }
        return undefined
      } else {
        return item
      }
    },
    moveUp(idx: number) {
      if (idx > 0) {
        const tmp = this.myEntities[idx]
        const tmp2 = this.myEntities[idx - 1]
        this.myEntities[idx] = tmp2
        this.myEntities[idx - 1] = tmp
      }
      this.$nextTick(() => {
        this.$forceUpdate()
      })
      this.$emit('entities-updated', this.myEntities)
    },
    moveDown(idx: number) {
      if (idx < this.myEntities.length - 1) {
        const tmp = this.myEntities[idx]
        const tmp2 = this.myEntities[idx + 1]
        this.myEntities[idx] = tmp2
        this.myEntities[idx + 1] = tmp
      }
      this.$nextTick(() => {
        this.$forceUpdate()
      })
      this.$emit('entities-updated', this.myEntities)
    },
    remove(idx: number) {
      this.myEntities.splice(idx, 1)
      this.$nextTick(() => {
        this.$forceUpdate()
      })
      this.$emit('entities-updated', this.myEntities)
    },
  },
})
</script>
<style lang="scss" scoped>
.selected {
  .video-wrapper,
  .collection-wrapper {
    border-color: $red;
    border-style: solid;
    border-width: 1px;
  }
}
</style>

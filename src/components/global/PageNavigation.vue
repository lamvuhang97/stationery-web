<template>
  <div class="pagination-wrapper">
    <div v-if="pageNumbers.length < 10" class="pagination-buttons">
      <button
        v-for="pageNumber of pageNumbers"
        :key="pageNumber"
        type="button"
        class="button page-icon"
        :class="{ active: pageNumber === currentPage }"
        @click="viewPage(pageNumber)"
      >
        {{ pageNumber }}
      </button>
    </div>
    <div v-if="pageNumbers.length >= 10" class="pagination-buttons">
      <button :key="1" type="button" class="button page-icon" @click="viewPage(1)">
        first
      </button>
      <button
        :key="pageNumbers[pageNumbers.length - 2]"
        type="button"
        class="button page-icon"
        :class="{ active: currentPage - 1 === currentPage }"
        @click="viewPage(currentPage - 1)"
      >
        PREVIOUS
      </button>
      <span>
        <button
          v-show="currentPage !== 1"
          :key="currentPage - 1"
          type="button"
          class="button page-icon"
          :class="{ active: currentPage - 1 === currentPage }"
          @click="viewPage(currentPage - 1)"
        >
          {{ currentPage - 1 }}
        </button>
        <button v-show="currentPage === 1" type="button" class="button page-icon-disabled" disabled>.</button>
        <button
          :key="currentPage"
          type="button"
          class="button page-icon"
          :class="{ active: currentPage === currentPage }"
          @click="viewPage(currentPage)"
        >
          {{ currentPage }}
        </button>

        <button
          v-show="currentPage !== lastPage"
          :key="currentPage + 1"
          type="button"
          class="button page-icon"
          :class="{ active: currentPage + 1 === currentPage }"
          @click="viewPage(currentPage + 1)"
        >
          {{ currentPage + 1 }}
        </button>
        <button v-show="currentPage === lastPage" type="button" class="button page-icon-disabled" disabled>.</button>
      </span>
      <button
        :key="2"
        type="button"
        class="button page-icon"
        :class="{ active: currentPage + 1 === currentPage }"
        @click="viewPage(currentPage + 1)"
      >
        next
      </button>

      <button :key="lastPage" type="button" class="button page-icon" @click="viewPage(lastPage)">
        LAST
      </button>
    </div>
    <p>Showing page {{ currentPage }} ({{ resultCount }} total items)</p>
  </div>
</template>

<script>
export default {
  name: 'PageNavigation',
  props: {
    resultCount: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    displayCount: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    pageNumbers() {
      const pageNumberArray = []
      for (let pg = 1; pg <= Math.ceil(this.resultCount / this.displayCount); pg++) {
        pageNumberArray.push(pg)
      }
      return pageNumberArray
    },
    lastPage() {
      return this.pageNumbers[this.pageNumbers.length - 1]
    },
  },
  methods: {
    viewPage(id) {
      if (id <= 0) {
        id = 1
      } else if (id >= this.lastPage) {
        id = this.lastPage
      }
      this.$emit('pageChange', id)
    },
  },
}
</script>

<style lang="scss" scoped>
.pagination-wrapper {
  text-align: center;
}

.pagination-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.pagination-wrapper .page-icon {
  display: inline-flex;
  min-width: 50px;
  height: auto;
  padding: 15px;
  margin: 5px;
  font-size: 16px;
  line-height: 1;
  letter-spacing: 0;
  background-color: $darkblue;

  &.active {
    background-color: $lightblue;
  }

  &:hover {
    background-color: $lightblue;
  }
}
.button-with-elipses {
  display: flex;
  flex-flow: row;
}

.pagination-wrapper .page-icon-disabled {
  display: inline-flex;
  min-width: 50px;
  height: auto;
  padding: 15px;
  margin: 5px;
  font-size: 16px;
  line-height: 1;
  color: $darkblue;
  letter-spacing: 0;
  background-color: $darkblue;
  border: none;
}
</style>

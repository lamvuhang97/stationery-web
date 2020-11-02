<template>
  <header class="site-header" :class="{ wuf: this.$route.path.includes('wolfjaw-studios') }">
    <nuxt-link class="site-title" to="/properties">
      <h1>{{ titleText }}</h1>
    </nuxt-link>
    <nav class="site-nav" role="navigation" aria-label="main navigation">
      <nuxt-link v-if="shouldShowNav" :to="'/' + currentProperty.id + '/views'">Views</nuxt-link>
      <nuxt-link v-if="shouldShowNav" :to="'/' + currentProperty.id + '/collections'">Collections</nuxt-link>
      <nuxt-link v-if="shouldShowNav" :to="'/' + currentProperty.id + '/videos'">Video</nuxt-link>
      <nuxt-link v-if="shouldShowNav" :to="'/' + currentProperty.id + '/documents'">Documents</nuxt-link>
      <nuxt-link v-if="shouldShowNav" :to="'/' + currentProperty.id + '/entitlements'">Entitlements</nuxt-link>
      <nuxt-link v-if="shouldShowNav" :to="'/' + currentProperty.id + '/subscribers'">Subscribers</nuxt-link>
      <nuxt-link v-if="shouldShowNav" :to="'/' + currentProperty.id + '/tokens'">Tokens</nuxt-link>
    </nav>
    <aside v-if="showLogout" class="user-info">
      <nuxt-link v-if="isManagingProperties" :to="'/users'">
        Manage Users
      </nuxt-link>
      <nuxt-link v-if="isManagingUsers" :to="'/properties'"> Manage {{ currentProperty.title }} </nuxt-link>
      <span class="username">{{ displayUserName }}</span>
      <a href="#" @click="logout">Logout</a>
    </aside>
  </header>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    titleText() {
      if (this.isManagingUsers) {
        return 'GXM User Management'
      } else if (this.shouldShowNav) {
        return this.currentProperty.title
      } else {
        return 'GXM Properties'
      }
    },
    currentProperty() {
      if (this.$store.getters['properties/getCurrentProperty'] !== undefined) {
        return this.$store.getters['properties/getCurrentProperty']
      }
      return { id: this.$route.params.property }
    },
    shouldShowNav() {
      return (
        this.$route.path !== '/' &&
        this.$route.path !== '/login' &&
        !this.isManagingUsers &&
        this.currentPropertyNumber !== -1
      )
    },
    isManagingUsers() {
      return this.$route.path.substr(0, 6) === '/users'
    },
    isManagingProperties() {
      return !this.isManagingUsers && this.$route.path !== '/'
    },
    showLogout() {
      return this.$route.path !== '/login'
    },
    currentPropertyNumber() {
      return this.$store.state.properties.currentProperty
    },
    displayUserName() {
      return this.$store.state.auth.user || ''
    },
  },
  methods: {
    async logout(event) {
      event.preventDefault()
      await this.$auth.logout()
      this.$router.push('/login')
    },
  },
})
</script>
<style lang="scss" scoped>
.site-header {
  display: flex;
  align-items: center;
  padding: 10px;

  @media (max-width: 1150px) {
    flex-direction: column;
  }
}
.site-title {
  margin-right: 25px;

  @media (max-width: 1150px) {
    margin-right: 0;
  }
  h1 {
    padding: 0;
    margin: 0;
    font-size: 18px;
  }
}
.site-nav {
  flex-grow: 1;
  padding-left: 25px;

  @media (max-width: 1150px) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-left: 0;
    margin: 15px 0;
  }

  @media (max-width: 550px) {
    justify-content: space-around;
  }
}
.user-info {
  display: flex;
  align-items: center;
  margin-right: 2px;

  @media (max-width: 1150px) {
    justify-content: center;
    width: 100%;
  }

  @media (max-width: 550px) {
    justify-content: space-around;
  }
  .username {
    margin: 0 25px;

    @media (max-width: 550px) {
      display: none;
    }
  }
}
.site-nav a,
.user-info a {
  margin: 0 10px;

  @media (max-width: 550px) {
    width: 40%;
    margin: 5px 0;
    text-align: center;
  }
  &.nuxt-link-active {
    color: $red;
  }
}

.wuf {
  background-color: black;
}
</style>

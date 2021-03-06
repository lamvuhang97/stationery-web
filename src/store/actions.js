import api from "../api"
import Vue from 'vue'
export default {
    async addCartItem({dispatch}, payload) {
        const res = await api.carts.createCart(payload)
        console.log(res);
        dispatch('fetchCart')
    },
    async fetchCart({commit}) {
        const res = await api.carts.getMyCart();
        var data = res.data.data
        const profile = await api.authentications.getProfile()
        Vue.prototype.$localstorage.setUserID(profile.data.id)
        console.log("kkk",Vue.prototype.$localstorage.getUserID())
        commit('setCart', data)
    },
    async updateProductAmount({dispatch}, payload) {
        const res = await api.carts.updateProductAmount(payload.id, payload.data)
        console.log(res);
        dispatch('fetchCart')
    },
    async deleteCart({dispatch}, payload) {
        const res = await api.carts.deleteCart(payload)
        console.log(res);
        dispatch('fetchCart')
    },

    async fetchWallet({commit}) {
        const profile = await api.authentications.getProfile()
        var data = profile.data.wallet
        console.log("wallet", profile);
        commit('setWallet', data)
    },
    async updateWallet({dispatch}, payload) {
        const res = await api.authentications.updateWallet(payload.id, payload.data)
        console.log(res);
        dispatch('fetchWallet')
    },

    getTask({commit}, task) {
        commit('getTask', task)
    },
    addTask({commit}) {
        commit('addTask')
    },
    editTask({commit}, task) {
        commit('editTask', task)
    },
    removeTask({commit}, task) {
        commit('removeTask', task)
    },
    completeTask({commit}, task) {
        commit('completeTask', task)
    },
    clearTask({commit}) {
        commit('clearTask')
    }
}
import api from "../api"
export default {
    async addCartItem({dispatch}, payload) {
        const res = await api.carts.createCart(payload)
        console.log(res);
        dispatch('fetchCart')
    },
    async fetchCart({commit}) {
        const res = await api.carts.getMyCart();
        var data = res.data.data
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
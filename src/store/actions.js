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
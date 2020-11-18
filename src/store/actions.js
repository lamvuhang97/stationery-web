import api from "../api"
export default {
    // addCartItem({commit}) {
    //     commit('addCartItem', cart)
    // },
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
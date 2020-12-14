export default {
    newTask: state => state.newTask,
    tasks: state => state.tasks.filter((task) => {return !task.completed}),
    completedTask: state => state.tasks.filter((task) => {return task.completed}),

    cartSize: state => { return state.cart.length},
    listCart: state => {return state.cart},
    wallet: state => {
        return state.wallet
    }
}
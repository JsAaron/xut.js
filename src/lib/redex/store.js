import todoApp from './modules/todoApp'

const createStore = window.Redux.createStore

const store = createStore(todoApp)


export {
    store
}

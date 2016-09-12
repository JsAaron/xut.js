import todo from './modules/todo'
import app from './modules/app'


const reducer = window.Redux.combineReducers({
    todo,
    app
})

export default window.Redux.createStore(reducer)

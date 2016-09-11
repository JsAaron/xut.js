import todo from './modules/todo'
import app from './modules/app'


const reducer = Redux.combineReducers({
    todo,
    app
})

export default Redux.createStore(reducer)

import * as types from '../mutation-types'


const initialState = {
    visibilityFilter: types.VisibilityFilters.SHOW_ALL,
    todos: []
}

export default function todoApp(state = initialState, action) {
    switch (action.type) {
        case types['SET_VISIBILITY_FILTER']:
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            })
        case types['ADD_TODO']:
            return Object.assign({}, state, {
                todos: [
                    ...state.todos, {
                        text: action.text,
                        completed: false
                    }
                ]
            })
        case types['TOGGLE_TODO']:
            return Object.assign({}, state, {
                todos: state.todos.map((todo, index) => {
                    if (index === action.index) {
                        return Object.assign({}, todo, {
                            completed: !todo.completed
                        })
                    }
                    return todo
                })
            })
        case types['DEST_TODO']:
        state = initialState 
        return initialState
        default:
            return state
    }
}

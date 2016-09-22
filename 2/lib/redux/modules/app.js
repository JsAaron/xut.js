import * as types from '../mutation-types'


const initialState = {
    visibilityFilter: types.VisibilityFilters.SHOW_ALL,
    apps: []
}

export default function App(state = initialState, action) {
    switch (action.type) {
        case types['SET_VISIBILITY_FILTER']:
            return Object.assign({}, state, {
                visibilityFilter: action.filter
            })
        case types['ADD_TODO']:
            return Object.assign({}, state, {
                apps: [
                    ...state.apps, {
                        text: action.text,
                        completed: false
                    }
                ]
            })
        case types['TOGGLE_TODO']:
            return Object.assign({}, state, {
                apps: state.apps.map((todo, index) => {
                    if (index === action.index) {
                        return Object.assign({}, todo, {
                            completed: !todo.completed
                        })
                    }
                    return todo
                })
            })
        default:
            return state
    }
}

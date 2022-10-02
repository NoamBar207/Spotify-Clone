const initialState = {
    player: null
}


export function playerReducer(state = initialState, action) {
    let newState = state
    let currSong

    switch (action.type) {
        case 'UPDATE_PLAYER':
            return (newState = { ...state, player: action.player })
        case 'SET_PLAYER':
            return (newState = { ...state, player: action.player })
        default:
            return state
    }
}
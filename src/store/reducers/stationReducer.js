

const initialState = {
    currSong: {},
    isPlaying: false,
}


export function stationReducer(state = initialState, action) {
    let newState = state
    let currSong

    switch (action.type) {
        case 'SET_CURR_SONG':
            return (newState = { ...state, currSong: action.song, isPlaying:true })
        case 'SET_IS_PLAYING':
            return (newState = { ...state, isPlaying: action.isPlaying })
        default:
            return state
    }
}
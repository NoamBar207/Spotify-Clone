

const initialState = {
    currSong: {},
    currStation: {},
    userStations : [],
    isPlaying: false,
}


export function stationReducer(state = initialState, action) {
    let newState = state

    switch (action.type) {
        case 'SET_CURR_STATION':
            return (newState = { ...state, currStation:action.station})
        case 'SET_CURR_SONG':
            return (newState = { ...state, currSong: action.song, isPlaying: true })
        case 'SET_IS_PLAYING':
            return (newState = { ...state, isPlaying: action.isPlaying })
        case 'SET_USER_STATIONS':
            return (newState = { ...state, userStations:action.userStations })
        default:
            return state
    }
}


const initialState = {
    currSong: {},
    currStation: {},
    likedStation: [],
    userStations: [],
    followedStations: [],
    isPlaying: false,
    isShuffeld:false
}


export function stationReducer(state = initialState, action) {
    let newState
    switch (action.type) {
        case 'SET_CURR_STATION':
            return (newState = { ...state, currStation: action.station })
        case 'SET_CURR_SONG':
            return (newState = { ...state, currSong: action.song, isPlaying: true })
        case 'SET_IS_PLAYING':
            return (newState = { ...state, isPlaying: action.isPlaying })
        case 'SET_USER_STATIONS':
            return (newState = { ...state, userStations: action.userStations })
        case 'SET_SHARED_STATIONS': {
            return (newState = { ...state, followedStations: action.followedStations })
        }
        case 'SET_IS_SHFFUELD': {
            return (newState = { ...state, isShuffeld: action.isShuffeld })
        }
        case 'SET_LIKED_SONGS':
            return (newState = { ...state, likedStation: action.likedStation })
        // case 'SAVED_STATION':
        //     return (newState ={ ...state, userStations})
        default:
            return state
    }
}
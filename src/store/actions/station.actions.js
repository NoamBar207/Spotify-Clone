// export function setCurrBoard(boardId) {
//     return async (dispatch) => {
//         let currBoard
//         try {
//             currBoard = await boardService.getById(boardId, true) ///CHECK
//             if (!currBoard) {
//                 currBoard = await boardService.getById(boardId)
//             }
//         } catch (err) {
//             console.error('Cannot set board', err)
//         } finally {
//             dispatch({ type: 'SET_BOARD', currBoard })
//         }
//     }
// }


const YOTUBE_SOURCE = 'https://www.youtube.com/embed/'



export function setCurrStation(station) {
    // console.log('setCurr Station ', station);
    return async (dispatch) => {
        try{
            const action = {type:'SET_CURR_STATION', station}
            dispatch(action)
        } catch(err){
            console.error('Cannot set currStation', err);
        }
    }
}


export function setCurrSong(song) {
    return async (dispatch, getState) => {
        // let currSong
        try {
            // currSong = YOTUBE_SOURCE+songVideoId
            const action = { type: 'SET_CURR_SONG', song }
            dispatch(action)
            const state = getState()
            console.log(state);
        } catch (err) {
            console.error('Cannot set currSong', err)
        }
    }
}


export function setIsPlaying(isPlaying) {
    return async (dispatch, getState) => {
        try {
            const action = { type: 'SET_IS_PLAYING', isPlaying }
            dispatch(action)
            const state = getState()
            console.log(state);
        } catch (err) {
            console.error('cannot set isPlaying', err);
        }
    }
}
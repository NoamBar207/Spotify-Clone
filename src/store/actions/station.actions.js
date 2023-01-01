
import { useNavigate } from "react-router-dom";
import { localStorageService } from "../../services/local.storage.service";
import { socketService, } from "../../services/socket.service";
import { stationService } from "../../services/station.service";
import { userService } from "../../services/user.service";


const YOTUBE_SOURCE = 'https://www.youtube.com/embed/'



export function setCurrStation(station) {
    // console.log('setCurr Station ', station);
    // socketService.emit(SOCKET_EMIT_STATION_UPDATE, station)
    return async (dispatch) => {
        try {
            const action = { type: 'SET_CURR_STATION', station }
            dispatch(action)
        } catch (err) {
            console.error('Cannot set currStation', err);
        }
    }
}

export function onSaveStation(station) {
    // socketService.emit(SOCKET_EMIT_STATION_UPDATE, station)
    return async (dispatch) => {
        try {
            const loggedInUser = await userService.getLoggedinUser()
            // socketService.emit('station-updated', { station: station, userId: loggedInUser._id })
            const savedStation = await stationService.updateStation(station)
            socketService.emit('station-updated', { station: savedStation })
            return savedStation

            // const action = { type: 'SAVED_STATION', station: {...savedStation} }
            // dispatch(action)
        } catch (err) {
            console.log('station: err in saveStation', err)
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

export function setUserStation(userStations) {
    return async (dispatch) => {
        try {
            const action = { type: 'SET_USER_STATIONS', userStations }
            dispatch(action)
        }
        catch (err) {
            console.error('cannot set user Stations', err);
        }
    }
}

export function setFollowedStations(followedStations) {
    return async (dispatch) => {
        try {
            const action = { type: 'SET_SHARED_STATIONS', followedStations }
            dispatch(action)
        }
        catch (err) {
            console.error('cannot set user Stations', err);
        }
    }
}




export function setLikedSongsUser(currUser) {
    return async (dispatch) => {
        try {
            const user = (Object.keys(currUser).length) ? currUser : localStorageService.getUser()
            const likedStation = {
                songs: user?.likedSongs,
                stationImg: "https://res.cloudinary.com/noambar/image/upload/v1667305422/Mellofy/liked-songs_jw062w.png",
                name: "Liked Songs",
                createdBy: user?._id,
                duration: stationService.getStationDuration(user?.likedSongs)
            }
            const action = { type: 'SET_LIKED_SONGS', likedStation }
            dispatch(action)
            return likedStation
        } catch (err) {
            console.error('cannot set user LikeStation', err);
        }
    }
}

// const onSetUserStations = async () => {
//     if (currUser.stations?.length) {
//         try {
//             let userStations = await Promise.all(
//                 currUser.stations.map(async (id) => {
//                     const station = await stationService.getById(id)
//                     return station
//                 })
//             )
//             dispatch(setUserStation(userStations))
//         } catch (err) {
//             console.log('Cannot Load user Stations ', err);
//         }
//     }
//     else dispatch(setUserStation([]))
// }

export function onSetUserStations(currUser) {
    return async (dispatch) => {
        if (currUser.stations?.length) {
            try {
                let userStations = await Promise.all(
                    currUser.stations.map(async (id) => {
                        const station = await stationService.getById(id)
                        return station
                    })
                )
                const action = { type: 'SET_USER_STATIONS', userStations }
                await dispatch(action)
                return userStations
            } catch (err) {
                console.log('Cannot Load user Stations ', err);
            }
        }
        // else if(!Object.keys(currUser).length){
        // }
        else {
            const user = localStorageService.loadFromStorage('user')
            console.log(user);
            if (user) {
                const stations = user.stations
                const action = { type: 'SET_USER_STATIONS', userStations: stations }
                await dispatch(action)
                return stations
            }
            else {
                const action = { type: 'SET_USER_STATIONS', userStations: [] }
                dispatch(action)
            }
        }
    }
}

export function onSetShuffele(bool) {
    return async (dispatch) => {
        try {
            const action = { type: 'SET_IS_SHFFUELD', isShuffeld: bool }
            dispatch(action)
        } catch (err) {
            console.log('Cannot set isShuffled', err);
        }
    }
}

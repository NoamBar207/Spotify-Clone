import { utilService } from "./util.service"



const USER_KEY = 'user'

export const localStorageService = {
    getUser,
    
    createNewStation,
    getById,
    updateStation,

    addSongToStation,
    addSongToLikeStation,



    loadFromStorage
}

function getUser() {
    let user = loadFromStorage(USER_KEY)
    return user
}

// Station Service
function createNewStation() {
    let user = loadFromStorage(USER_KEY)
    let newStation = { songs: [], _id: `guest_${_makeId()}`, stationImg: "https://res.cloudinary.com/noambar/image/upload/v1666548318/Mellofy/Rock--Roll-Florent-Bodart-Poster_b2m2ft.webp", name: 'New Playlist', duration: '00:00' }
    if (!user) user = { stations: [newStation], fullname: 'Guest', likedStation: [], username: 'Guest' }
    else user = { ...user, stations: [...user.stations, newStation] }
    saveToStorage(USER_KEY, user)
    return newStation
}

function getById(stationId) {
    let user = loadFromStorage(USER_KEY)
    return user.stations.find(station => station._id === stationId)
}

function updateStation(updatedStation) {
    let user = loadFromStorage(USER_KEY)
    const idx = user.stations.findIndex(station => station._id === updatedStation._id)
    user.stations.splice(idx, 1, updatedStation)
    saveToStorage(USER_KEY, user)
}

function getLikeStation(){
    let user = loadFromStorage(USER_KEY)

}




//Song Service
function addSongToStation(station) {
    let user = loadFromStorage(USER_KEY)
    let stationIdx = user.stations.findIndex(userStation => station._id === userStation._id)
    user.stations.splice(stationIdx, 1, station)
    saveToStorage(USER_KEY, user)
    return station
}

function addSongToLikeStation(song) {
    let user = loadFromStorage(USER_KEY)
    if (!user) user = { stations: [], fullname: 'Guest', likedSongs: [song], username: 'Guest' }
    else {
        let songIdx = user.likedSongs.findIndex(likedSong => song.videoId === likedSong.videoId);
        (songIdx === -1) ? user.likedSongs.push(song) : user.likedSongs.splice(songIdx, 1)
    }
    saveToStorage(USER_KEY, user)
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}



function _makeId(length = 5) {
    var text = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function getStationDuration(songs) {
    let mins = 0
    let secs = 0
    songs.forEach(song => {
        const arr = song.duration.split(':')
        mins += +arr[0]
        secs += +arr[1]
    });
    const total = secs + mins * 60
    return utilService.convertSecsToMinute(total)
}
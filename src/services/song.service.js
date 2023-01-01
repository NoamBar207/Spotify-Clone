import { httpService } from "./http.service"
import { localStorageService } from "./local.storage.service"
import { uploadService } from "./upload.service"
import { utilService } from "./util.service"
import { YTService } from "./youtube.service"

export const songService = {
    query,
    getById,
    songEditor,
    addSong,
    addSongToLike,
    updateSong
}

async function query(value) {
    // const stations = await storageService.query(STORAGE_KEY)
    // const stations = await httpService.get(STORAGE_KEY)
    const songs = await httpService.get(`search/${value}`)
    // console.log(songs);
    return songs
}

async function getById(videoId) {
    var song = await httpService.get(`search/videoId/${videoId}`)
    return Promise.resolve(song);
}

async function addSong(song) {
    const duration = await YTService.getSongDuration(song.videoId)
    const resUpload = await uploadService.uploadImg(song.snippet.thumbnails.high.url)
    song = {
        ...song,
        duration,
        snippet: {
            thumbnails: {
                high: {
                    url: resUpload.url
                }
            },
            title: song.snippet.title
        }
    }
    const songToReturn = await httpService.post('search', song)
}

async function updateSong(song) {
    const songToReturn = await httpService.put('search', song)
    return songToReturn
}

async function addSongToLike(currSong, user, isSongLiked) {
    // let isSongLiked = false
    // user.likedSongs?.forEach(song => {
    //     if (song.videoId === currSong.videoId) isSongLiked = true
    // })]
    if(!Object.keys(user).length) localStorageService.addSongToLikeStation(currSong)
    else{
        let userToReturn = { ...user }
        if (isSongLiked) {
            const likedSongs = user.likedSongs.filter(song => song.videoId !== currSong.videoId)
            userToReturn.likedSongs = likedSongs
        } else {
            const songToAdd = (currSong.snippet.thumbnails.high.url.includes('cloudinary')) ?
            currSong : await getById(currSong.videoId)
            userToReturn.likedSongs.push(songToAdd)
        }
        return userToReturn
    } 
}

function songEditor(song) {
    let songToReturn = {
        videoId: song.id.videoId,
        snippet: {
            title: utilService.titleEditor(song.snippet.title),
            thumbnails: song.snippet.thumbnails
        },
        createdAt: Date.now()
    }
    // console.log(songToReturn);
    return songToReturn
}

import { httpService } from "./http.service"
import { utilService } from "./util.service"
import { YTService } from "./youtube.service"

export const songService = {
    query,
    songEditor,
    addSong,
    addSongToLike
}

async function query(value) {
    // const stations = await storageService.query(STORAGE_KEY)
    // const stations = await httpService.get(STORAGE_KEY)
    const songs = await httpService.get(`search/${value}`)
    // console.log(songs);
    return songs
}

async function addSong(song) {
    const duration = await YTService.getSongDuration(song.videoIdvideoId)
    song = {...song, duration}
    const songToReturn = await httpService.post('search', song)
}

function addSongToLike(currSong, user, isSongLiked) {
    // let isSongLiked = false
    // user.likedSongs?.forEach(song => {
    //     if (song.videoId === currSong.videoId) isSongLiked = true
    // })
    if (isSongLiked) {
        let userToReturn = { ...user }
        const likedSongs= user.likedSongs.filter(song => song.videoId !== currSong.videoId)
        userToReturn.likedSongs =likedSongs
        return userToReturn
    } else {
        let userToReturn = { ...user }
        const songToAdd = {
            createdAt: currSong.createdAt,
            snippet: currSong.snippet,
            videoId: currSong.videoId,
        }
        userToReturn.likedSongs.push(songToAdd)
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

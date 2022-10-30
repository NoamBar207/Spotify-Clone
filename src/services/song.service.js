import { httpService } from "./http.service"
import { utilService } from "./util.service"

export const songService = {
    query,
    songEditor,
    addSong
}

async function query(value) {
    // const stations = await storageService.query(STORAGE_KEY)
    // const stations = await httpService.get(STORAGE_KEY)
    const songs = await httpService.get(`search/${value}`)
    // console.log(songs);
    return songs
}

async function addSong(song){
    const songToReturn = await httpService.post('search', song)
}

function songEditor(song) {
    let songToReturn = {
        videoId: song.id.videoId,
        snippet: {
            title: utilService.titleEditor(song.snippet.title),
            thumbnails:song.snippet.thumbnails
        },
        createdAt:Date.now()
    }
    // console.log(songToReturn);
    return songToReturn
}
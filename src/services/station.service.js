import { storageService } from './async-storage.service'
import { httpService } from './http.service'
// const gStation = require('../data/station.json')
// console.log(gStation);
// const gStation

const STORAGE_KEY = 'station'

const PAGE_SIZE = 5
export const stationService = {
    query,
    getById,
    loadUserStations
    // remove,
    // save
}



async function query() {
    // const stations = await storageService.query(STORAGE_KEY)
    // const stations = await httpService.get(STORAGE_KEY)
    const stations = await httpService.get(STORAGE_KEY)
    return stations
}

// async function update(station) {
//     var updatedStation = await storageService.put(STORAGE_KEY, station)

//     return updatedStation
// }

async function getById(stationId) {
    var station = await httpService.get(`${STORAGE_KEY}/${stationId}`)
    return Promise.resolve(station);
}

async function loadUserStations(stationsId){
    var stations = await httpService.get(STORAGE_KEY)
    return Promise.resolve(stations);
}



// function query(filterBy = { txt: '' }) {
//     // const regex = new RegExp(filterBy)
//     return Promise.resolve(gStation);
// }

// function remove(stationId) {
//     const idx = gStation.findIndex(song => song._id === songId)
//     gStation.splice(idx, 1)
//     return _saveSongsToFile();
// }


// function save(song) {
//     if (song._id) {
//         const idx = gStation.findIndex(currSong => currSong._id === song._id)
//         gStation[idx] = song
//     } else {
//         song._id = _makeId();
//         gStation.push(song);
//     }
//     return _saveSongsToFile().then(() => song);
// }

// function _makeId(length = 5) {
//     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//     var txt = ''
//     for (let i = 0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length))
//     }
//     return txt
// }

// function _saveSongsToFile() {
//     return new Promise((resolve, reject) => {
//         fs.writeFile('data/station.json', JSON.stringify(gStation, null, 2), (err) => {
//             if (err) {
//                 console.log(err);
//                 reject('Cannot write to file')
//             } else {
//                 console.log('Wrote Successfully!')
//                 resolve()
//             }
//         })
//     })
// }







import { httpService } from './http.service'
import { userService } from './user.service'
import { utilService } from './util.service'
// const gStation = require('../data/station.json')
// console.log(gStation);
// const gStation

const STORAGE_KEY = 'forum'

export const forumService = {
    query,
    sendMsg,
    addQuestion
    // getById,
    // loadUserStations,
    // createNewStation,
    // addSongToStation,
    // updateStation,
    // deleteStation,
    // remove,
    // save

    // getStationDuration
}



async function query() {
    // const stations = await storageService.query(STORAGE_KEY)
    // const stations = await httpService.get(STORAGE_KEY)
    const forum = await httpService.get(STORAGE_KEY)
    return forum
}

async function sendMsg(ans, msg, cluster, subject) {
    msg.ans.push(ans)
    // console.log(msg, 'msg');
    // console.log(cluster, 'cluster');
    // console.log(subject, 'subject');
    await httpService.put('forum', {msg,subject})
}

async function addQuestion(question, cluster, subject) {
    cluster.msgs.push(question)
    await httpService.put('forum', {question,cluster,subject})
}
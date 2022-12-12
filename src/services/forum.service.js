





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
    addQuestion,
    addLikeToAnswer
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
    // msg.ans.push(ans)
    // console.log(msg, 'msg');
    // console.log(cluster, 'cluster');
    // console.log(subject, 'subject');
    if (ans.txt.length > 1)
        return await httpService.put('forum/answer', { ans, msg, cluster, subject })
}

async function addQuestion(question, cluster, subject) {
    // cluster.msgs.push(question)
    return await httpService.put('forum/question', { question, cluster, subject })
}

async function addLikeToAnswer(ans, userId, question, cluster, subject) {
    // !ans.likes.includes(userId) ? ans.likes.push(userId) : 
    if (userId !== 'Guest') {
        const isInclude = ans.likes.includes(userId)
        utilService.removeOrAdd(ans.likes, userId, isInclude)
        console.log(ans);
        // ans = {...ans ,likes:newAns}
        // ans.likes = newAns
        // console.log(cluster);
        // httpService.put('forum', { ans, cluster, subject })
        httpService.put('forum/like', { ans, question, cluster, subject })
        return ans
    }
    // await httpService.put('forum', {msg,subject})
}
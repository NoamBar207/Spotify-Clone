import axios from "axios"


let YT_KEY = 'AIzaSyD7vhkvZFDLl3bcZ8e0hamadt1xa93WvRA'

export const YTService = {
    getSongSearch,
    getSongDuration
}



async function getSongSearch(value) {
    try {
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${YT_KEY}&q=${value}`)
        console.log(data);
        return data
        // return {Hello:'Hello'}
    } catch (err) {

    }
}

async function getSongDuration(songId) {
    try {
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${songId}&key=${YT_KEY}&part=snippet,contentDetails,statistics,status`)
        let str = data.items[0].contentDetails.duration
        const timeStrDigits = str.match(/([0-9]+)/g)
        const duration = timeStrDigits.map((timeStrDigit, idx) => {
            if (idx !== 0 && timeStrDigit.length === 1) return `0${timeStrDigit}`
            else return timeStrDigit
        })
        return duration.join(':')
    } catch (error) {
        console.log('request faild', error)
    }
}
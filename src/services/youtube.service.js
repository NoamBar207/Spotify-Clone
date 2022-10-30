import axios from "axios"


let YT_KEY = 'AIzaSyD7vhkvZFDLl3bcZ8e0hamadt1xa93WvRA'

export const YTService = {
    getSongSearch
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
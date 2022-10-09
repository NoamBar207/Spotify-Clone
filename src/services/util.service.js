
var cloneDeep = require('lodash.clonedeep');

export const utilService = {
    getSongDurationToMin,
    getFormatedDate,
    shuffleFunc
}



function getSongDurationToMin(songDuration) {
    let stringToReturn
    if (songDuration >= 60) {
        let min = Math.floor(songDuration / 60)
        let sec = Math.floor((songDuration / 60 - min) * 60)
        if (sec > 60) {
            sec = '0'
            min += 1
        } if (sec < 10) {
            sec = '0' + sec
        } if (sec === 0) {
            sec = '00'
        }
        stringToReturn = '0' + min + ':' + sec
    } else {
        stringToReturn = '00:' + songDuration

        if (songDuration < 10) {
            stringToReturn = '00:0' + songDuration
        }
        if (songDuration === 0) {
            stringToReturn = '00:00'
        }
    }

    // console.log(stringToReturn);
    return stringToReturn
}

function getFormatedDate(date) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const MM = date.toLocaleString('en-us', options)
    // const time = date.toLocaleTimeString()
    const createdAt = `${MM}`
    return createdAt
}

function shuffleFunc(songs, currSong) {
    console.log(songs, 'songs');
    let songsCopy = cloneDeep(songs)
    console.log(songsCopy);
    // let songsCopy = JSON.parse(JSON.stringify(songs))
    // console.log(songsCopy[0], 'songsCopy');
    let songsCopyLength = songsCopy.length - 1
    let currSongIdx = songsCopy.findIndex(song => (song.id.videoId === currSong.id.videoId))
    let listToReturn = [songsCopy[currSongIdx]]
    // While there remain elements to shuffle.
    while (songsCopyLength != 0) {

        // Pick a remaining element.
        console.log(Math.random(), songsCopyLength);
        let randomIndex = Math.floor(Math.random() * songsCopyLength);
        songsCopyLength--;
        // And swap it with the current element.
        listToReturn.push(songsCopy[randomIndex])
        songsCopy.splice(randomIndex)
        console.log(songsCopy);
        //   [songs[currentIndex], songs[randomIndex]] = [
        // songs[randomIndex], songs[currentIndex]];
    }
    return listToReturn;

    // console.log(copySongs);
    // let currentIndex = songs.length, randomIndex;

    // // While there remain elements to shuffle.
    // while (currentIndex != 0) {

    //     // Pick a remaining element.
    //     randomIndex = Math.floor(Math.random() * currentIndex);
    //     currentIndex--;

    //     // And swap it with the current element.
    //     [songs[currentIndex], songs[randomIndex]] = [
    //         songs[randomIndex], songs[currentIndex]];
    // }
    // console.log(songs);
    // return songs;
}


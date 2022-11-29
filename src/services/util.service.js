
var cloneDeep = require('lodash.clonedeep');

export const utilService = {
    getSongDurationToMin,
    getFormatedDate,
    shuffleFunc,
    titleEditor,
    getAutorName,
    getSongName,
    toggleModal,
    closeModal,
    openModal,
    removeOrAdd,
    toggleDisplayNone,
    convertSecsToMinute
}



function getAutorName(song, idx) {
    // let fullTitle = currSong.snippet.title
    // let idxToSplit = 0
    // if (fullTitle.includes('-')) {
    //     idxToSplit = fullTitle.indexOf('-')
    // } 
    // if (fullTitle.includes('(')) {
    //     let idxOfTitleFinish = fullTitle.indexOf('(')
    // } else setSongName(fullTitle.slice(idxToSplit))
    if (idx > 3) return
    else {
        let fullTitle = song.snippet.title
        let idxToSplit
        if (fullTitle.includes('-')) {
            idxToSplit = fullTitle.indexOf('-')
        }
        let authorSong = fullTitle.slice(0, idxToSplit)
        return authorSong
    }
}

function getSongName(song) {
    let fullTitle = song.snippet.title
    let idxToSplitStart
    let idxToSplitEnd
    let songName
    if (fullTitle.includes('-')) idxToSplitStart = fullTitle.indexOf('-')
    if (fullTitle.includes('(')) idxToSplitEnd = fullTitle.indexOf('(')
    songName = fullTitle.slice(idxToSplitStart + 1, idxToSplitEnd)
    return songName
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

function titleEditor(title) {
    let idx = title.indexOf('&')
    console.log(idx);
    let titleToReturn = idx ? title.slice(0, idx) + title.slice(idx + 5) : title
    console.log(titleToReturn);
    return titleToReturn
}

function toggleDisplayNone(refType) {
    refType.current.classList.toggle('hide-none')
}

function toggleModal(refType) {
    refType.current.classList.toggle('hide')
}

function closeModal(refType) {
    refType.current.classList.add('hide')
}

function openModal(refType) {
    refType.current.classList.remove('hide')
}

function removeOrAdd(arr, value, isInclude) {
    if (isInclude) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
        }
    } else arr.push(value)
    return arr;
}


function convertSecsToMinute(value) {
    return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00')
}
export const utilService = {
    getSongDurationToMin,
}



function getSongDurationToMin (songDuration) {
    let min = parseInt(songDuration/60)
    let sec = parseInt((songDuration/60 - min)*100)
    let stringToReturn = ''+min+':'+sec
    // console.log(stringToReturn);
    return stringToReturn
}
import getAverageColor from "get-average-color";

var cloneDeep = require("lodash.clonedeep");

export const utilService = {
  getSongDurationToMin,
  getFormatedDate,
  getFormatedDateWithTime,
  shuffleFunc,
  titleEditor,
  getAutorName,
  getSongName,
  toggleModal,
  closeModal,
  openModal,
  removeOrAdd,
  toggleDisplayNone,
  convertSecsToMinute,
  onLoadPopUp,
  getAvgColor,
};

function getAutorName(song, idx) {
  // let fullTitle = currSong.snippet.title
  // let idxToSplit = 0
  // if (fullTitle.includes('-')) {
  //     idxToSplit = fullTitle.indexOf('-')
  // }
  // if (fullTitle.includes('(')) {
  //     let idxOfTitleFinish = fullTitle.indexOf('(')
  // } else setSongName(fullTitle.slice(idxToSplit))
  if (!Object.keys(song).length) return;
  if (idx > 3) return;
  else {
    let fullTitle = song.snippet.title;
    let idxToSplit;
    if (fullTitle.includes("-")) {
      idxToSplit = fullTitle.indexOf("-");
    }
    let authorSong = fullTitle.slice(0, idxToSplit);
    return authorSong;
  }
}

function getSongName(song) {
  if (!Object.keys(song).length) return;
  let fullTitle = song.snippet.title;
  let idxToSplitStart;
  let idxToSplitEnd;
  let songName;
  if (fullTitle.includes("-")) idxToSplitStart = fullTitle.indexOf("-");
  if (fullTitle.includes("(")) idxToSplitEnd = fullTitle.indexOf("(");
  songName = fullTitle.slice(idxToSplitStart + 1, idxToSplitEnd);
  return songName;
}

function getSongDurationToMin(songDuration) {
  let stringToReturn;
  if (songDuration >= 60) {
    let min = Math.floor(songDuration / 60);
    let sec = Math.floor((songDuration / 60 - min) * 60);
    if (sec > 60) {
      sec = "0";
      min += 1;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    if (sec === 0) {
      sec = "00";
    }
    stringToReturn = "0" + min + ":" + sec;
  } else {
    stringToReturn = "00:" + songDuration;

    if (songDuration < 10) {
      stringToReturn = "00:0" + songDuration;
    }
    if (songDuration === 0) {
      stringToReturn = "00:00";
    }
  }

  return stringToReturn;
}

function getFormatedDate(date) {
  const options = { month: "short", day: "numeric", year: "numeric" };
  const MM = date.toLocaleString("en-us", options);
  const createdAt = `${MM}`;
  return createdAt;
}

function shuffleFunc(songs, currSong) {
  let songsCopy = cloneDeep(songs);
  let songsCopyLength = songsCopy.length - 1;
  let currSongIdx = songsCopy.findIndex(
    (song) => song.id.videoId === currSong.id.videoId
  );
  let listToReturn = [songsCopy[currSongIdx]];
  // While there remain elements to shuffle.
  while (songsCopyLength != 0) {
    // Pick a remaining element.
    let randomIndex = Math.floor(Math.random() * songsCopyLength);
    songsCopyLength--;
    // And swap it with the current element.
    listToReturn.push(songsCopy[randomIndex]);
    songsCopy.splice(randomIndex);
  }
  return listToReturn;
}

function titleEditor(title) {
  let idx = title.indexOf("&");
  let titleToReturn = idx ? title.slice(0, idx) + title.slice(idx + 5) : title;
  return titleToReturn;
}

function toggleDisplayNone(refType) {
  refType.current.classList.toggle("hide-none");
}

function toggleModal(refType) {
  refType.current.classList.toggle("hide");
}

function closeModal(refType) {
  refType.current.classList.add("hide");
}

function openModal(refType) {
  refType.current.classList.remove("hide");
}

function removeOrAdd(arr, value, isInclude) {
  if (isInclude) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
  } else arr.push(value);
  return arr;
}

function onLoadPopUp(popUpRef) {
  popUpRef.current.classList.add("show");
  setTimeout(() => {
    popUpRef.current.classList.remove("show");
  }, 5000);
}

function convertSecsToMinute(value) {
  return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : "00");
}

function getFormatedDateWithTime(date) {
  const options = { month: "short", day: "numeric" };
  const MM = date.toLocaleString("en-us", options);
  let time = date.toLocaleTimeString();
  time = time.slice(0, time.length - 3);
  const createdAt = `${MM} , ${time}`;
  return createdAt;
}

async function getAvgColor(img) {
  try {
    let color = await getAverageColor(img);
    return color;
  } catch (err) {
    console.log("get avg clr error", err);
  }
}

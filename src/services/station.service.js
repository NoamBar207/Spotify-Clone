import { storageService } from "./async-storage.service";
import { httpService } from "./http.service";
import { localStorageService } from "./local.storage.service";
import { songService } from "./song.service";
import { userService } from "./user.service";
import { utilService } from "./util.service";

const STORAGE_KEY = "station";

const PAGE_SIZE = 5;
export const stationService = {
  query,
  getById,
  loadUserStations,
  createNewStation,
  addSongToStation,
  updateStation,
  deleteStation,
  shuffleStation,

  getStationDuration,
};

async function query() {
  const stations = await httpService.get(STORAGE_KEY);
  return stations;
}

async function getById(stationId) {
  var station = !stationId.includes("guest")
    ? await httpService.get(`${STORAGE_KEY}/${stationId}`)
    : localStorageService.getById(stationId);
  return Promise.resolve(station);
}

async function loadUserStations(stationsId) {
  var userStations = stationsId.map(async (id) => {
    const station = await getById(id);
    return station;
  });
  return Promise.resolve(userStations);
}

async function createNewStation(currUser) {
  // let user = await userService.getLoggedinUser()
  let num = currUser.stations.length + 1;
  let stationToAdd = {
    name: `Playlist #${num}`,
    songs: [],
    stationImg:
      "https://res.cloudinary.com/noambar/image/upload/v1669327809/ifrojzsgy2pxgztg1inn.png",
    createdBy: currUser._id,
    renderType: "",
  };
  if (Object.keys(currUser).length) {
    const newUser = await httpService.post(STORAGE_KEY, stationToAdd);
    userService.saveLocalUser(newUser);
    return newUser;
  }
}

async function addSongToStation(song, station, currUser) {
  // let user = await userService.getLoggedinUser()
  if (song.etag) song = songService.getById(song.id.videoId);
  let returnStation;
  const songToAdd = {
    createdAt: song.createdAt,
    snippet: song.snippet,
    videoId: song.videoId,
    duration: song.duration,
  };
  let includeIdx = station.songs.findIndex(
    (stationSong) => stationSong.videoId === songToAdd.videoId
  );
  if (includeIdx === -1) {
    station.songs.push(songToAdd);
    station = { ...station, duration: getStationDuration(station.songs) };
  } else {
    station.songs.splice(includeIdx, 1);
    station = { ...station, duration: getStationDuration(station.songs) };
    // returnStation = await httpService.post(`${STORAGE_KEY}/${station._id}`, station)
  }
  if (Object.keys(currUser).length)
    returnStation = await httpService.post(
      `${STORAGE_KEY}/${station._id}`,
      station
    );
  else returnStation = localStorageService.addSongToStation(station);
  return returnStation;
}

async function updateStation(station) {
  let user = await userService.getLoggedinUser();
  // const objToSend = {station,currUser}
  // const updatedUserOrStation = await httpService.put(STORAGE_KEY, station)
  if (station.name === "Liked Songs") {
    let updateUser = {
      ...user,
      likedSongs: station.songs,
    };
    updateUser = await userService.updateUser(updateUser);
    return updateUser;
  } else {
    const updatedUserOrStation = await httpService.put(STORAGE_KEY, station);
    return updatedUserOrStation;
  }
}

async function deleteStation(stationId) {
  const updatedUser = await httpService.delete(`${STORAGE_KEY}/${stationId}`);
  return updatedUser;
}

function getStationDuration(songs) {
  let mins = 0;
  let secs = 0;
  songs?.forEach((song) => {
    const arr = song.duration.split(":");
    mins += +arr[0];
    secs += +arr[1];
  });
  const total = secs + mins * 60;
  return utilService.convertSecsToMinute(total);
}

function shuffleStation(array, currSong) {
  let currentIndex = array.length - 1;
  let randomIndex;
  const newArr = array.filter((song) => song.videoId !== currSong.videoId);
  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArr[currentIndex], newArr[randomIndex]] = [
      newArr[randomIndex],
      newArr[currentIndex],
    ];
  }
  if (Object.keys(currSong).length) newArr.unshift(currSong);
  return newArr;
}

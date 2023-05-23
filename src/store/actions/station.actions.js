import { localStorageService } from "../../services/local.storage.service";
import { socketService } from "../../services/socket.service";
import { stationService } from "../../services/station.service";
import { storageService } from "../../services/async-storage.service";

const YOTUBE_SOURCE = "https://www.youtube.com/embed/";

export function setCurrStation(station) {
  return async (dispatch) => {
    try {
      const action = { type: "SET_CURR_STATION", station };
      dispatch(action);
    } catch (err) {
      console.error("Cannot set currStation", err);
    }
  };
}

export function onSaveStation(station) {
  return async (dispatch) => {
    try {
      const savedStation = await stationService.updateStation(station);
      socketService.emit("station-updated", { station: savedStation });
      return savedStation;
    } catch (err) {
      console.log("station: err in saveStation", err);
    }
  };
}

export function setCurrSong(song) {
  return async (dispatch, getState) => {
    try {
      const action = { type: "SET_CURR_SONG", song };
      dispatch(action);
    } catch (err) {
      console.error("Cannot set currSong", err);
    }
  };
}

export function setIsPlaying(isPlaying) {
  return async (dispatch, getState) => {
    try {
      const action = { type: "SET_IS_PLAYING", isPlaying };
      dispatch(action);
    } catch (err) {
      console.error("cannot set isPlaying", err);
    }
  };
}

export function setUserStation(userStations) {
  return async (dispatch) => {
    try {
      const action = { type: "SET_USER_STATIONS", userStations };
      dispatch(action);
    } catch (err) {
      console.error("cannot set user Stations", err);
    }
  };
}

export function setFollowedStations(followedStations) {
  return async (dispatch) => {
    try {
      const action = { type: "SET_SHARED_STATIONS", followedStations };
      dispatch(action);
    } catch (err) {
      console.error("cannot set user Stations", err);
    }
  };
}

export function setUserLikedSongs(currUser) {
  return async (dispatch) => {
    try {
      const user = Object.keys(currUser).length
        ? currUser
        : storageService.load("user");
      const likedStation = {
        songs: user ? user.likedSongs : [],
        // songs: user?.likedSongs ,
        stationImg:
          "https://res.cloudinary.com/noambar/image/upload/v1667305422/Mellofy/liked-songs_jw062w.png",
        name: "Liked Songs",
        createdBy: user?._id,
        duration: stationService.getStationDuration(user?.likedSongs),
      };
      const action = { type: "SET_LIKED_SONGS", likedStation };
      dispatch(action);
      return likedStation;
    } catch (err) {
      console.error("cannot set user LikeStation", err);
    }
  };
}

export function setUserStations(currUser) {
  return async (dispatch) => {
    if (currUser.stations?.length) {
      try {
        let userStations = await Promise.all(
          currUser.stations.map(async (id) => {
            const station = await stationService.getById(id);
            return station;
          })
        );
        const action = { type: "SET_USER_STATIONS", userStations };
        await dispatch(action);
        return userStations;
      } catch (err) {
        console.log("Cannot Load user Stations ", err);
      }
    } else {
      const user = localStorageService.loadFromStorage("user");
      if (user) {
        const stations = user.stations;
        const action = { type: "SET_USER_STATIONS", userStations: stations };
        await dispatch(action);
        return stations;
      } else {
        const action = { type: "SET_USER_STATIONS", userStations: [] };
        dispatch(action);
      }
    }
  };
}

export function onSetShuffele(bool) {
  return async (dispatch) => {
    try {
      const action = { type: "SET_IS_SHFFUELD", isShuffeld: bool };
      dispatch(action);
    } catch (err) {
      console.log("Cannot set isShuffled", err);
    }
  };
}

export function onCreateStation(currUser) {
  return async (dispatch) => {
    if (Object.keys(currUser).length) {
      const newUser = await stationService.createNewStation(currUser);
      const index = newUser.stations.length - 1;
      const station = await stationService.getById(newUser.stations[index]);
      return { newUser, station };
    } else {
      const { station } = await localStorageService.createNewStation();
      return station;
    }
  };
}

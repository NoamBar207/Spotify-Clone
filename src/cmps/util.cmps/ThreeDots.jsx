import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { localStorageService } from "../../services/local.storage.service";
import { storageService } from "../../services/async-storage.service";
import { socketService } from "../../services/socket.service";
import { songService } from "../../services/song.service";
import { stationService } from "../../services/station.service";
import { userService } from "../../services/user.service";
import { utilService } from "../../services/util.service";
import {
  setUserStations,
  setCurrStation,
  setUserLikedSongs,
} from "../../store/actions/station.actions";
import { onSetLocalUser, onUpdateUser } from "../../store/actions/user.action";

export const ThreeDots = ({ song }) => {
  const [isLiked, setIsLiked] = useState(false);
  const dotsRef = useRef();
  const playlistRef = useRef();
  const dispatch = useDispatch();
  const { currStation, userStations } = useSelector(
    (state) => state.stationModule
  );
  const { currUser, localUser } = useSelector((state) => state.userModule);
  const [renderLine, setRenderLine] = useState("Save to your Liked Songs");

  useEffect(() => {
    const user = Object.keys(currUser).length
      ? currUser
      : storageService.load("user");
    onLoad(user);
  }, [currUser, localUser]);

  const onLoad = async (user) => {
    let isSongLiked = false;
    user?.likedSongs?.forEach((songLiked) => {
      if (song.videoId === songLiked.videoId) isSongLiked = true;
    });
    setIsLiked(isSongLiked);
    isSongLiked
      ? setRenderLine("Remove from your Liked Songs")
      : setRenderLine("Save to your Liked Songs");
  };

  const onThreeDots = (ev, ref) => {
    ev.stopPropagation();
    utilService.toggleModal(ref);
  };

  const onAddSong = async (station) => {
    let newStation = await stationService.addSongToStation(
      song,
      station,
      currUser
    );
    if (Object.keys(currUser).length) {
      socketService.emit("station-updated", { station: newStation });
      dispatch(onUpdateUser({ ...currUser }));
    }
    if (currStation._id === newStation._id)
      dispatch(setCurrStation({ ...newStation }));
    dotsRef.current.classList.toggle("hide");
    playlistRef.current.classList.toggle("hide");
  };

  function toggleModal() {
    dotsRef.current.classList.toggle("hide");
  }
  function toggleModal2(ev) {
    playlistRef.current.classList.toggle("hide");
  }

  const toggleLike = async () => {
    // const song = (!songProp) ? currSong : songProp
    let userReturned = await songService.addSongToLike(song, currUser, isLiked);
    setIsLiked(!isLiked);
    if (Object.keys(currUser).length) {
      userReturned = await userService.updateUser(userReturned);
      dispatch(onUpdateUser(userReturned));
    } else {
      dispatch(onSetLocalUser(userReturned));
      dispatch(setUserLikedSongs(userReturned));
    }
  };

  return (
    <div
      className="three-dots-container"
      onClick={(ev) => ev.nativeEvent.stopImmediatePropagation()}
    >
      <span
        onClick={() => {
          utilService.toggleModal(dotsRef);
          utilService.closeModal(playlistRef);
        }}
      >
        <i className="fa-solid fa-ellipsis"></i>
      </span>
      <section
        className="three-dots-modal hide"
        ref={dotsRef}
        onClick={(ev) => ev.stopPropagation()}
      >
        <button className="three-dots-btn" onClick={toggleLike}>
          {renderLine}
        </button>
        {!!userStations.length ? (
          <button
            className="three-dots-btn"
            onClick={() => utilService.toggleModal(playlistRef)}
          >
            Add to playlist
          </button>
        ) : (
          <span className="three-dots-btn">Create playlist to add songs!</span>
        )}
      </section>
      {!!userStations?.length && (
        <div className="playlist-modal three-dots-modal hide" ref={playlistRef}>
          {userStations.map((station) => {
            return (
              <button
                className="three-dots-btn"
                onClick={() => onAddSong(station)}
                key={station._id}
              >
                {station.songs.some(
                  (songStation) => song.videoId === songStation.videoId
                ) && <div className="song-indication">✔</div>}
                {station.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

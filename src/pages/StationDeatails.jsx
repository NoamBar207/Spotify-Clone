import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StationHeader } from "../cmps/StationHeader";
import { stationService } from "../services/station.service";
import {
  onSaveStation,
  setCurrSong,
  setCurrStation,
  setIsPlaying,
} from "../store/actions/station.actions";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { StationSong } from "../cmps/util.cmps/StationSong";
import { onUpdateUser } from "../store/actions/user.action";
import {
  socketService,
  SOCKET_EMIT_UPDATE_STATION,
} from "../services/socket.service";
import { utilService } from "../services/util.service";
import { userService } from "../services/user.service";
import { localStorageService } from "../services/local.storage.service";

export function StationDeatails() {
  const dispatch = useDispatch();
  const { currSong, isPlaying, currStation, isShuffeld, likedStation } =
    useSelector((state) => state.stationModule);
  const { currUser, localUser } = useSelector((state) => state.userModule);
  const [songsOrder, setSongsOrder] = useState([]);
  const [users, setUsers] = useState([]);
  const { stationId } = useParams();
  const dotsRef = useRef();
  const usersRef = useRef();
  const navigate = useNavigate();
  const [bgc, setBgc] = useState("#4A3591");

  const [isVisible, setIsVisible] = useState(false);
  const stationHeaderRef = useRef(null);
  const playBtnRef = useRef();
  const detailHeaderRef = useRef();
  // const [isCarActionClosed, setIsCarActionClosed] = useState(false);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(cbFunction, options);
    if (stationHeaderRef.current) observer.observe(stationHeaderRef.current);

    return () => {
      if (stationHeaderRef.current)
        observer.unobserve(stationHeaderRef.current);
    };
  }, [stationHeaderRef, bgc]);

  const cbFunction = (entries) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
    if (!entry.isIntersecting) {
      playBtnRef.current.classList.add("no-section-header");
      playBtnRef.current.classList.remove("play-btn-station");
      playBtnRef.current.style.background = `linear-gradient(90deg, rgba(0,0,0,.6) , #282828 150%), ${bgc} `;
      detailHeaderRef.current.style.background = "#121212";
    } else {
      playBtnRef.current.classList.remove("no-section-header");
      playBtnRef.current.classList.add("play-btn-station");
      playBtnRef.current.style.background = "transparent";
      detailHeaderRef.current.style.background = "transparent";
    }
  };

  useEffect(() => {
    socketService.off("update-station");
    socketService.on("update-station", (station) => {
      // if (currStation._id === station._id) dispatch({ type: 'SET_CURR_STATION', station })
      console.log(stationId, station._id);
      if (stationId === station._id) setSongsOrder([...station.songs]);
    });
    return () => {
      socketService.off(SOCKET_EMIT_UPDATE_STATION);
    };
  }, []);

  useEffect(() => {
    console.log("effect");
    loadStation();
    setUpFunc();
    loadUsers();
    getAvgColor();
  }, [currStation, currUser, localUser]);

  const setUpFunc = async () => {
    if (currStation.songs?.length && isShuffeld)
      setSongsOrder(currStation.songs);
    else if (!isShuffeld) {
      let station;
      if (!currStation.name.includes("Liked Songs"))
        station = await stationService.getById(currStation._id);
      else station = likedStation;
      setSongsOrder(station.songs);
    } else setSongsOrder([]);
  };

  const loadStation = async () => {
    try {
      if (!Object.keys(currStation).length) {
        const station = await stationService.getById(stationId);
        await dispatch(setCurrStation({ ...station }));
      }
    } catch {
      console.error("cannot load Stations");
    }
  };

  const loadUsers = async () => {
    const users = await userService.getUsers();
    setUsers(users);
  };

  const cutExtraTitle = (songTitle) => {
    // {
    //     song.snippet.title.includes('(') ?
    //     const idx = song.snippet.title.indexOf('(')
    // }/
    //TODO :::: add more chars
    if (songTitle.includes("(")) {
      const idx = songTitle.indexOf("(");
      songTitle = songTitle.slice(0, idx);
    }
    return songTitle;
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;
    if (
      currStation.createdBy !== currUser._id &&
      !currStation.createdBy.includes("guest")
    )
      return;
    const newSongsOrder = Array.from(songsOrder);
    const [movedSong] = newSongsOrder.splice(result.source.index, 1);
    newSongsOrder.splice(result.destination.index, 0, movedSong);
    setSongsOrder(newSongsOrder);
    const updatedStation = { ...currStation, songs: newSongsOrder };
    if (isShuffeld) dispatch(setCurrStation(updatedStation));
    else if (Object.keys(currUser).length) {
      const newUserOrStation = await stationService.updateStation(
        updatedStation
      );
      if (currStation.name === "Liked Songs") {
        dispatch(onUpdateUser(...newUserOrStation));
      } else dispatch(onSaveStation(newUserOrStation));
    } else {
      localStorageService.updateStation(updatedStation);
      // dispatch(setCurrStation(updatedStation));
    }
  };

  const onDeletePlaylist = async () => {
    const updatedUser = await stationService.deleteStation(stationId);
    dispatch(onUpdateUser(updatedUser));
    navigate("/");
  };

  // const getAutorName = (song) => {
  //     // let fullTitle = currSong.snippet.title
  //     // let idxToSplit = 0
  //     // if (fullTitle.includes('-')) {
  //     //     idxToSplit = fullTitle.indexOf('-')
  //     // }
  //     // if (fullTitle.includes('(')) {
  //     //     let idxOfTitleFinish = fullTitle.indexOf('(')
  //     // } else setSongName(fullTitle.slice(idxToSplit))

  //     let fullTitle = song.snippet.title
  //     let idxToSplit
  //     if (fullTitle.includes('-')) {
  //         idxToSplit = fullTitle.indexOf('-')
  //     }
  //     let authorSong = fullTitle.slice(0, idxToSplit)
  //     return authorSong
  // }

  const onPlay = () => {
    if (!Object.keys(currSong).length && currStation.songs.length) {
      dispatch(setCurrSong(currStation.songs[0]));
    } else {
      if (isPlaying) {
        dispatch(setIsPlaying(false));
      } else {
        dispatch(setIsPlaying(true));
      }
    }
  };

  const getAvgColor = async () => {
    let resColor = await utilService.getAvgColor(currStation.stationImg);
    resColor = `rgb(${resColor.r - 10},${resColor.g - 10}, ${resColor.b - 10})`;
    setBgc(resColor);
  };

  if (!Object.keys(currStation).length) navigate("/");
  return (
    <section className="station-deatils">
      <div ref={stationHeaderRef}>
        <StationHeader />
      </div>
      <div
        className="color-container"
        style={{
          background: `linear-gradient(rgba(0,0,0,.6) 0, #121212 20%), ${bgc}`,
        }}
      >
        <div className="play-btn-station" ref={playBtnRef}>
          {/* <h1 style={{color: 'white'}}> { stationId } </h1> */}
          {/* <span onClick={onPlay}><i className="fa-solid fa-circle-play" style={{ width: '56px', height: '56px', color: '#1fdf64' }}></i></span> */}
          {!isPlaying && (
            <span onClick={onPlay} className="play-btn">
              <i className="fa-solid fa-circle-play"></i>
            </span>
          )}
          {isPlaying && (
            <span onClick={onPlay} className="play-btn">
              <i className="fa-solid fa-circle-pause"></i>
            </span>
          )}
          <div
            className="three-dots-container"
            onClick={(ev) => ev.nativeEvent.stopImmediatePropagation()}
          >
            <span
              onClick={() => {
                utilService.toggleModal(dotsRef);
                utilService.closeModal(usersRef);
              }}
            >
              <i className="fa-solid fa-ellipsis"></i>
            </span>
            <section
              className="three-dots-modal hide"
              ref={dotsRef}
              onClick={(ev) => ev.stopPropagation()}
            >
              <button
                className="three-dots-btn"
                onClick={() => utilService.toggleModal(usersRef)}
              >
                Add listeners
              </button>
              <button className="three-dots-btn" onClick={onDeletePlaylist}>
                Delete playlist
              </button>
            </section>
            <div
              className="playlist-modal three-dots-modal hide"
              ref={usersRef}
            >
              {users.length &&
                users.map((user) => {
                  return (
                    <button
                      className="three-dots-btn"
                      onClick={() =>
                        userService.toggleStationToUser(user, stationId)
                      }
                      key={user._id}
                    >
                      {user.fullname}
                    </button>
                  );
                })}
            </div>
          </div>
          {!isVisible && (
            <span style={{ color: "white" }}> {currStation.name}</span>
          )}
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="station-details-container">
            {(provided) => (
              <ul
                className="station-details-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {!!songsOrder.length && (
                  <li className="details-header" ref={detailHeaderRef}>
                    <div style={{ width: "14px" }}>#</div>
                    <div style={{ flex: "1" }}>TITLE</div>
                    <div style={{ width: "100px" }}>DATE ADDED</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "16px",
                        width: "125px",
                        paddingRight: "9px",
                      }}
                    >
                      <i className="fa-regular fa-clock"></i>
                    </div>
                  </li>
                )}
                {/* <div>Album</div> */}
                {!songsOrder.length && (
                  <div>
                    <h1>
                      Let's find something for your playlist, use our search bar
                    </h1>
                  </div>
                )}
                {songsOrder.map((song, idx) => {
                  return (
                    <Draggable
                      key={song.videoId}
                      draggableId={song.videoId}
                      index={idx}
                      isDragDisabled={
                        currStation.createdBy !== currUser._id &&
                        !currStation.createdBy.includes("guest")
                          ? true
                          : false
                      }
                    >
                      {(provided) => (
                        <li
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="draggable-song"
                        >
                          <StationSong
                            key={song.videoId}
                            song={song}
                            idx={idx}
                          ></StationSong>
                          {/* {song.snippet.title.includes('(') ? <h3>{cutExtraTitle(song.snippet.title)}</h3> : <h3>{song.snippet.title}</h3>} */}
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </section>
  );
}

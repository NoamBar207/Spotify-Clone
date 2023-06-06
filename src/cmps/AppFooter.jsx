import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  onSetShuffele,
  setCurrSong,
  setCurrStation,
  setIsPlaying,
} from "../store/actions/station.actions";
import YouTube from "react-youtube";
import { setPlayer } from "../store/actions/player.action";
import { SliderBar } from "./util.cmps/SlideBar";
import { utilService } from "../services/util.service";
import { LikeButton } from "./util.cmps/LikeButton";
import { stationService } from "../services/station.service";
import { ResponsiveFooter } from "./responsiveLayout/ResponsiveFooter";
import { useLocation, useNavigate } from "react-router-dom";
import { SongTitleAuthor } from "./util.cmps/SongTitleAuthor";

export const AppFooter = () => {
  const { currSong, isPlaying, currStation, isShuffeld } = useSelector(
    (state) => state.stationModule
  );
  const { currUser } = useSelector((state) => state.userModule);
  const { player } = useSelector((state) => state.playerModule);

  const [songName, setSongName] = useState("");
  const [songAutor, setSongAutor] = useState("");
  const [songDuration, setSongDuration] = useState(0);
  const [songTotalDuration, setSongTotalDuration] = useState("");
  const [songTotalDurationNum, setSongTotalDurationNum] = useState(0);
  const [volume, setVolume] = useState(0);
  const [reapetInd, setReapetInd] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // let songTimeInterval = useRef(0)
  let intervalId = useRef();
  let appFooterRef = useRef();

  const dispatch = useDispatch();
  const opts = {
    height: "00",
    width: "00",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  useEffect(() => {
    if (Object.keys(player).length && isPlaying) playerOnPlay();
    else if (Object.keys(player).length && !isPlaying) playerOnPause();
  }, [isPlaying]);

  useEffect(() => {
    let isSongLiked = false;
    currUser.likedSongs?.forEach((song) => {
      if (song.videoId === currSong.videoId) isSongLiked = true;
    });
    setIsLiked(isSongLiked);
  }, [currSong]);

  useEffect(() => {
    addClassOnSongDeatails();
  }, [location, currSong]);

  const playerReady = (event) => {
    //cleaning
    clearInterval(intervalId.current);
    setSongDuration(0);
    titleSplitter();
    event.target.playVideo();

    //setters
    dispatch(setIsPlaying(true));
    dispatch(setPlayer(event.target));
    setSongTotalDuration(
      utilService.getSongDurationToMin(+event.target.getDuration())
    );
    setSongTotalDurationNum(+event.target.getDuration());
    if (!volume) {
      setVolume(event.target.getVolume());
    }
  };

  const playerOnPlay = () => {
    // if (songDuration) {
    //     console.log(songDuration, 'heree58');
    //     player.seekTo(50)
    // }
    clearInterval(intervalId.current);
    intervalId.current = setInterval(() => {
      setSongDuration((prevDuration) => +prevDuration + 1);
    }, 1000);
    if (player.i) {
      player.playVideo();
      player.setVolume(volume);
    }
  };

  const playerOnPause = () => {
    if (!Object.keys(player).length) return;
    clearInterval(intervalId.current);
    player.pauseVideo();
  };

  const titleSplitter = () => {
    let fullTitle = currSong.snippet.title;
    setSongAutor("");
    setSongName("");
    let idxToSplit = 0;
    if (fullTitle.includes("-")) {
      idxToSplit = fullTitle.indexOf("-");
      setSongAutor(fullTitle.slice(0, idxToSplit));
    }
    if (fullTitle.includes("(")) {
      let idxOfTitleFinish = fullTitle.indexOf("(");
      setSongName(fullTitle.slice(idxToSplit + 1, idxOfTitleFinish));
    } else setSongName(fullTitle.slice(idxToSplit + 1));
  };

  const togglePlayer = (ev) => {
    ev.stopPropagation();
    isPlaying ? dispatch(setIsPlaying(false)) : dispatch(setIsPlaying(true));
  };

  const handleChangeVolume = (event) => {
    setVolume(event.target.value);
    player.setVolume(event.target.value);
  };

  const handleChangeSongMin = (event) => {
    // setVolume(event.target.value)
    // player.setVolume(event.target.value)
    if (window.innerWidth <= 480 && !location.pathname.includes("song")) return;
    setSongDuration(event.target.value);
    player.seekTo(event.target.value);
  };

  const onNextSong = () => {
    let idxRem = currStation.songs.findIndex(
      (song) => song.videoId === currSong.videoId
    );
    clearInterval(intervalId.current);
    if (reapetInd === "repeat-one") {
      player.seekTo(0);
      setSongDuration(0);
    } else if (reapetInd === "repeat-all") {
      if (idxRem + 1 === currStation.songs.length) {
        idxRem = 0;
        dispatch(setCurrSong(currStation.songs[idxRem]));
      } else dispatch(setCurrSong(currStation.songs[idxRem + 1]));
      player.seekTo(0);
      setSongDuration(0);
    } else if (idxRem + 1 < currStation.songs.length) {
      dispatch(setCurrSong(currStation.songs[idxRem + 1]));
    } else return;
  };

  const onPrevSong = () => {
    let idxRem = currStation.songs.findIndex(
      (song) => song.videoId === currSong.videoId
    );
    clearInterval(intervalId.current);
    if (reapetInd === "repeat-one") {
      player.seekTo(0);
      setSongDuration(0);
    } else if (reapetInd === "repeat-all") {
      if (!idxRem) {
        idxRem = currStation.songs.length - 1;
        dispatch(setCurrSong(currStation.songs[idxRem]));
      } else dispatch(setCurrSong(currStation.songs[idxRem - 1]));
      player.seekTo(0);
      setSongDuration(0);
    } else {
      if (!idxRem) {
        player.seekTo(0);
        setSongDuration(0);
      } else dispatch(setCurrSong(currStation.songs[idxRem - 1]));
    }
  };

  const onShuffle = async () => {
    const shuffeldSongs = stationService.shuffleStation(
      [...currStation.songs],
      currSong
    );
    dispatch(onSetShuffele(!isShuffeld));
    dispatch(setCurrStation({ ...currStation, songs: shuffeldSongs }));
  };

  const onReapet = () => {
    if (Object.keys(currSong).length) {
      if (!reapetInd) setReapetInd("repeat-all");
      else if (reapetInd === "repeat-all") setReapetInd("repeat-one");
      else setReapetInd("");
    } else return;
  };

  const onAppFooter = () => {
    if (window.innerWidth <= 480 && Object.keys(currSong).length)
      navigate(`/song/${currSong.videoId}`);
  };

  const addClassOnSongDeatails = () => {
    if (window.innerWidth <= 780 && !Object.keys(currSong).length)
      appFooterRef.current.classList.add("hide-player-mobile");
    else appFooterRef.current.classList.remove("hide-player-mobile");
    if (
      location.pathname.includes("song") &&
      !location.pathname.includes("likedsongs")
    )
      appFooterRef.current.classList.add("song-deatails-player");
    else appFooterRef.current.classList.remove("song-deatails-player");
  };

  // {(window.innerWidth <= 480 && !Object.keys(currSong).length) ? <></> :

  return (
    <main>
      <section className="app-footer" ref={appFooterRef} onClick={onAppFooter}>
        <div className="curr-song">
          {Object.keys(currSong).length ? (
            <div className="curr-song-container">
              <div className="curr-song-img">
                <img src={currSong.snippet.thumbnails.high.url} alt="" />
                {/* <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={this._onReady} /> */}
                <YouTube
                  videoId={currSong?.videoId}
                  opts={opts}
                  onReady={playerReady}
                  onPlay={playerOnPlay}
                  onPause={playerOnPause}
                  onEnd={onNextSong}
                />
              </div>
              <SongTitleAuthor song={currSong} />
              <LikeButton />
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="song-player-container">
          <div className="song-player-controls">
            <div className="song-player-left">
              <div onClick={onShuffle} className="footer-shuffele-repeat">
                {!isShuffeld && (
                  <span>
                    <i
                      className="fa-solid fa-shuffle"
                      style={{ color: "white" }}
                    ></i>
                  </span>
                )}
                {isShuffeld && (
                  <span>
                    <i
                      className="fa-solid fa-shuffle"
                      style={{ color: "green" }}
                    ></i>
                  </span>
                )}
              </div>
              <div onClick={onPrevSong} className="footer-next-prev">
                <span>
                  <i
                    className="fa-solid fa-backward-step"
                    style={{ color: "white" }}
                  ></i>
                </span>
              </div>
            </div>
            <div className="song-player-play-pause">
              {!isPlaying && (
                <span onClick={(ev) => togglePlayer(ev)}>
                  <i
                    className="fa-solid fa-circle-play"
                    style={{ color: "white" }}
                  ></i>
                </span>
              )}
              {isPlaying && (
                <span onClick={(ev) => togglePlayer(ev)}>
                  <i
                    className="fa-solid fa-circle-pause"
                    style={{ color: "white" }}
                  ></i>
                </span>
              )}
            </div>
            <div className="song-player-right">
              <div onClick={onNextSong} className="footer-next-prev">
                <span>
                  <i
                    className="fa-solid fa-forward-step"
                    style={{ color: "white" }}
                  ></i>
                </span>
              </div>
              <div onClick={onReapet} className="footer-shuffele-repeat">
                {!reapetInd && (
                  <span>
                    <i
                      className="fa-solid fa-repeat"
                      style={{ color: "white" }}
                    ></i>
                  </span>
                )}
                {reapetInd === "repeat-all" && (
                  <span>
                    <i
                      className="fa-solid fa-repeat"
                      style={{ color: "green" }}
                    ></i>
                  </span>
                )}
                {reapetInd === "repeat-one" && (
                  <span className="repeat-one-span">
                    <i
                      className="fa-solid fa-repeat"
                      style={{ color: "green" }}
                    ></i>
                    <span className="repeat-one">1</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="song-time-slider">
            <h1>{utilService.getSongDurationToMin(songDuration)}</h1>
            <SliderBar
              disabled={false}
              value={+songDuration}
              maxValue={songTotalDurationNum}
              handleChange={handleChangeSongMin}
            />
            {Object.keys(currSong).length ? (
              <h1>{songTotalDuration}</h1>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="app-footer-volume">
          <div className="volume-container">
            {!volume && (
              <span>
                <i
                  className="fa-solid fa-volume-off"
                  style={{ color: "white" }}
                ></i>
              </span>
            )}
            {!!volume && (
              <span>
                <i
                  className="fa-solid fa-volume-high"
                  style={{ color: "white" }}
                ></i>
              </span>
            )}
          </div>
          <div style={{ width: "93px" }}>
            <SliderBar
              disabled={false}
              value={volume}
              maxValue={100}
              handleChange={(event) => handleChangeVolume(event)}
            />
          </div>
        </div>
      </section>
      {window.innerWidth <= 780 ? <ResponsiveFooter /> : <></>}
    </main>
  );
};

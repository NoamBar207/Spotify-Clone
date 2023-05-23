import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { importService } from "../services/import-img-service";
import { userService } from "../services/user.service";
import { stationService } from "../services/station.service";
import { onSetLocalUser, onUpdateUser } from "../store/actions/user.action";
import {
  setUserStations,
  setCurrStation,
  setFollowedStations,
  setUserLikedSongs,
  onCreateStation,
} from "../store/actions/station.actions";
import { socketService } from "../services/socket.service";
import { localStorageService } from "../services/local.storage.service";
import { storageService } from "../services/async-storage.service";

export const MainMenu = () => {
  const { currUser, localUser } = useSelector((state) => state.userModule);
  const { userStations, currStation, likedStation, followedStations } =
    useSelector((state) => state.stationModule);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userStationState, setUserStationState] = useState(userStations);
  const [likedStationState, setLikedStationState] = useState(likedStation);

  useEffect(() => {
    socketService.off("update-user");
    socketService.off("update-station");

    socketService.on("update-user", (user) => {
      dispatch(onUpdateUser(user));
    });

    socketService.on("update-station", (station) => {
      getUserOnMenu().then((res) => {
        res.followedStations.forEach((stationId) => {
          if (stationId === station._id) dispatch(onUpdateUser({ ...res }));
        });
      });
    });

    return () => {
      socketService.off("update-user");
      socketService.off("update-station");
    };
  }, []);

  useEffect(() => {
    if (
      !Object.keys(currUser).length &&
      !Object.keys(storageService.load("user")).length
    )
      dispatch(onSetLocalUser(localStorageService.createLocalUser()));
    asyncSet();
  }, [currStation, currUser, localUser]);

  const asyncSet = () => {
    onGetUserStations();
    onGetUserLikedSongs();
    onSetFollowedStations();
  };

  const getUserOnMenu = async () => {
    const res = await userService.getLoggedinUser();
    return res;
  };

  const onGetUserLikedSongs = async () => {
    const likedStation = await dispatch(setUserLikedSongs(currUser));
    setLikedStationState(likedStation);
  };

  const onGetUserStations = async () => {
    const stations = await dispatch(setUserStations(currUser));
    setUserStationState(stations);
  };

  const onSetFollowedStations = async () => {
    if (currUser.followedStations?.length) {
      try {
        let followedStations = await Promise.all(
          currUser.followedStations.map(async (id) => {
            const station = await stationService.getById(id);
            return station;
          })
        );
        dispatch(setFollowedStations([...followedStations]));
      } catch (err) {
        console.log("Cannot Load shared Stations ", err);
      }
    } else dispatch(setFollowedStations([]));
  };

  // const onCreateStation = async () => {
  //   if (Object.keys(currUser).length) {
  //     const newUser = await stationService.createNewStation(currUser);
  //     await dispatch(onUpdateUser(newUser));
  //     const index = newUser.stations.length - 1;
  //     const station = await stationService.getById(newUser.stations[index]);
  //     await dispatch(setCurrStation(station));
  //     navigate(`/station/${station._id}`);
  //   } else {
  //     const { newStation, user } = await localStorageService.createNewStation();
  //     dispatch(setCurrStation(newStation));
  //     navigate(`/station/${newStation._id}`);
  //   }
  // };

  const onCreateNewStation = async () => {
    const res = await dispatch(onCreateStation(currUser));
    if (res.newUser) {
      await dispatch(onUpdateUser(res.newUser));
      await dispatch(setCurrStation(res.station));
      navigate(`/station/${res.station._id}`);
    } else {
      dispatch(setCurrStation(res));
      navigate(`/station/${res._id}`);
    }
  };

  const onPlaylistPick = async (station) => {
    await dispatch(setCurrStation(station));
    station.name === "Liked Songs"
      ? navigate("/station/likedsongs")
      : navigate(`/station/${station._id}`);
  };

  const onLibrary = () => {
    if (!Object.keys(currUser).length && !storageService.load("user"))
      localStorageService.createLocalUser();
  };

  return (
    <section className="main-menu-container">
      <div className="menu-actions">
        <Link className="menu-link" onClick={onLibrary} to={"/library"}>
          <i
            className="fa-solid fa-book"
            style={{ color: "white", height: "24px", width: "24px" }}
          ></i>
          Your Library
        </Link>
        <Link className="menu-link" onClick={onCreateNewStation}>
          <div className="menu-create-playlist">
            <i className="fa-solid fa-plus" style={{ color: "black" }}></i>
          </div>
          Create Playlist
        </Link>
        {/* <MenuActions links={links} /> */}
        <Link
          className="menu-link"
          onClick={() => onPlaylistPick(likedStationState)}
        >
          <img
            src={importService.likedSongs}
            style={{ height: "24px", width: "24px" }}
            alt=""
          />
          Liked Songs
        </Link>
      </div>

      {!!userStationState?.length && (
        <>
          <hr />

          <div className="user-stations">
            <div className="menu-stations-title">Your Playlists:</div>
            {userStationState.map((station) => {
              return (
                <Link
                  className="menu-link"
                  onClick={() => onPlaylistPick(station)}
                  key={station._id}
                >
                  {station.name}
                </Link>
              );
            })}
          </div>
        </>
      )}
      {!!followedStations?.length && (
        <>
          <hr />
          <div className="user-stations">
            <div className="menu-stations-title">Shared Playlist:</div>
            {!!followedStations?.length &&
              followedStations.map((station) => {
                return (
                  <Link
                    className="menu-link"
                    onClick={() => onPlaylistPick(station)}
                    key={station?._id}
                  >
                    {station?.name}
                  </Link>
                );
              })}
          </div>
        </>
      )}
    </section>
  );
};

import { fontSize } from "@mui/system";
import { useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { stationService } from "../services/station.service";
import { uploadService } from "../services/upload.service";
import { userService } from "../services/user.service";
import {
  onSaveStation,
  setCurrStation,
} from "../store/actions/station.actions";

import { useParams } from "react-router-dom";
import { localStorageService } from "../services/local.storage.service";
import { utilService } from "../services/util.service";

export function StationHeader() {
  const { currStation } = useSelector((state) => state.stationModule);
  const { currUser } = useSelector((state) => state.userModule);
  const [stationName, setStationName] = useState(currStation.name);
  const dispatch = useDispatch();
  const [stationCreator, setStationCreator] = useState({});
  const [duration, setDuration] = useState([]);
  const [headerColor, setHeaderColor] = useState(["#4A3591, #2A1F52"]);
  const { stationId } = useParams();

  useEffect(() => {
    setStationName(currStation.name);
    if (currStation.createdBy) getCreator();
    else setStationCreator({ fullname: "Mellofy", imgUrl: "" });
    loadDuration();
    getAvgColor();
    // stationService.getStationDuration(currStation.songs)
    //////// ADD IMG URL
  }, [currStation]);

  const handleChange = async (ev) => {
    const value = ev.target.value;
    Object.keys(currUser).length
      ? await dispatch(onSaveStation({ ...currStation, name: value }))
      : localStorageService.updateStation({ ...currStation, name: value });
    dispatch(setCurrStation({ ...currStation, name: value }));
  };

  const getCreator = async () => {
    const creatorStation = await userService.getById(currStation.createdBy);
    setStationCreator(creatorStation);
  };

  const loadDuration = () => {
    if (currStation.duration) {
      const arr = currStation.duration.split(":");
      setDuration(arr);
    }
  };

  const handleUpload = async (ev) => {
    let tempVal = await uploadService.uploadImg(ev);
    if (tempVal.url) {
      Object.keys(currUser).length
        ? await dispatch(
            onSaveStation({ ...currStation, stationImg: tempVal.url })
          )
        : localStorageService.updateStation({
            ...currStation,
            stationImg: tempVal.url,
          });
      await dispatch(
        setCurrStation({ ...currStation, stationImg: tempVal.url })
      );
    }
  };

  const getAvgColor = async () => {
    let resColor = await utilService.getAvgColor(currStation.stationImg);
    resColor = `rgb(${resColor.r},${resColor.g}, ${resColor.b})`;
    setHeaderColor([resColor]);
  };

  return (
    <section
      className="station-header-container"
      style={{
        background: `linear-gradient(transparent 0,rgba(0,0,0,.5) 100%),${headerColor[0]}`,
      }}
    >
      <div className="station-header-img">
        {currStation.stationImg ? (
          <img src={currStation.stationImg} alt="" />
        ) : (
          <div className="station-header-no-pic">
            <i className="fa-solid fa-music"></i>
          </div>
        )}
        {currStation.createdBy === currUser._id &&
          currStation.name !== "Liked Songs" && (
            <label className="station-header-choose-pic">
              <i className="fa-solid fa-pencil"></i>Choose photo
              <input
                className="file-input"
                type="file"
                name="imgUrl"
                // value={credentials.img}
                onChange={(ev) => handleUpload(ev)}
                style={{ visibility: "hidden", height: "0" }}
              />
            </label>
          )}
      </div>
      <div className="station-header-deatails">
        {currStation.renderType === "byGanere" && (
          <h1 className="playlist">Ganere</h1>
        )}
        {currStation.renderType === "byArtist" && (
          <h1 className="playlist">✅Artist</h1>
        )}
        {currStation.renderType === "" && (
          <h1 className="playlist">Playlist</h1>
        )}
        {currUser._id === currStation.createdBy ? (
          <DebounceInput
            className="station-header"
            value={stationName}
            // value={currStation.name}
            name="title"
            minLength={5}
            type="text"
            debounceTimeout={2000}
            onChange={handleChange}
          />
        ) : (
          <h1 className="station-header">{currStation.name}</h1>
        )}
        <div className="station-info">
          <div className="header-station-user-logo">
            {stationCreator.username}
          </div>
          <span className="length-duration">
            {currStation.songs?.length} songs -{" "}
            <span className="duration-span">
              {duration[0]} min {duration[1]} sec
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

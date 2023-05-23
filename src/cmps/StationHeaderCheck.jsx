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
import getAverageColor from "get-average-color";
import { useParams } from "react-router-dom";

export function StationHeaderCheck() {
  const { currStation } = useSelector((state) => state.stationModule);
  const [stationState, setStationState] = useState({});
  const { currUser } = useSelector((state) => state.userModule);
  const [stationName, setStationName] = useState(currStation.name);
  const dispatch = useDispatch();
  const [stationCreator, setStationCreator] = useState({});
  const [duration, setDuration] = useState([]);
  const [headerColor, setHeaderColor] = useState(["#4A3591, #2A1F52"]);
  const { stationId } = useParams();

  useEffect(() => {
    // setStationName(currStation.name)
    // if (currStation.createdBy) getCreator()
    // else setStationCreator({ fullname: 'Mellofy', imgUrl: '' })
    loadState();
    loadDuration();
    getAvgColor();
    // stationService.getStationDuration(currStation.songs)
    //////// ADD IMG URL
  }, [stationId]);

  const loadState = async () => {
    try {
      const station = await stationService.getById(stationId);
      setStationState(station);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (ev) => {
    const value = ev.target.value;
    dispatch(onSaveStation({ ...currStation, name: value }));
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
      dispatch(onSaveStation({ ...currStation, stationImg: tempVal.url }));
      dispatch(setCurrStation({ ...currStation, stationImg: tempVal.url }));
    }
  };

  const getAvgColor = async () => {
    let color = await getAverageColor(stationState.stationImg);
    // const darkerColor =`rgb(${color.r-20},${color.g-20}, ${color.b-20})`
    color = `rgb(${color.r},${color.g}, ${color.b})`;
    await setHeaderColor([color]);
  };

  // linear-gradient(${headerColor[0]},${headerColor[1]})
  if (!Object.keys(stationState).length) return <h1>loading...</h1>;
  return (
    <section
      className="station-header-container"
      style={{
        background: `linear-gradient(transparent 0,rgba(0,0,0,.5) 100%),${headerColor[0]}`,
      }}
    >
      <div className="station-header-img">
        {stationState.stationImg ? (
          <img src={stationState.stationImg} alt="" />
        ) : (
          <div className="station-header-no-pic">
            <i className="fa-solid fa-music"></i>
          </div>
        )}
        {stationState.createdBy === currUser._id && (
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
        <h1 className="playlist">PLAYLIST</h1>
        {currUser._id === stationState.createdBy ? (
          <DebounceInput
            className="station-header"
            value={stationName}
            // value={stationState.name}
            name="title"
            minLength={5}
            type="text"
            debounceTimeout={2000}
            onChange={handleChange}
          />
        ) : (
          <h1 className="station-header">{stationState.name}</h1>
        )}
        <div className="station-info">
          <div className="header-station-user-logo">
            {stationCreator.username}
          </div>
          <span className="length-duration">
            {currStation.songs.length} songs -{" "}
            <span className="duration-span">
              {duration[0]} min {duration[1]} sec
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

import { useSelector } from "react-redux";
import { CardCmp } from "../cmps/util.cmps/CardCmp";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  onCreateStation,
  setCurrStation,
} from "../store/actions/station.actions";
import { onUpdateUser } from "../store/actions/user.action";

export const LibraryPage = () => {
  const { userStations, likedStation, followedStations } = useSelector(
    (state) => state.stationModule
  );
  const { currUser, localUser } = useSelector((state) => state.userModule);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <section className="library-page-container">
      <div className="your-playlist-container">
        <h1>Your Playlists</h1>
        <Link
          className="menu-link"
          onClick={onCreateNewStation}
          title="Create Playlist"
        >
          <div className="menu-create-playlist">
            <i className="fa-solid fa-plus" style={{ color: "black" }}></i>
          </div>
        </Link>
      </div>
      <div className="library-grid-container">
        {!!Object.keys(likedStation).length && (
          <div className="library-liked-card">
            <CardCmp station={likedStation} />
          </div>
        )}
        {!!Object.keys(userStations).length &&
          userStations.map((station) => <CardCmp station={station} />)}
      </div>
      <h1>Followed Stations</h1>
      <div className="library-grid-container">
        {!!Object.keys(followedStations).length &&
          followedStations.map((station) => <CardCmp station={station} />)}
      </div>
    </section>
  );
};

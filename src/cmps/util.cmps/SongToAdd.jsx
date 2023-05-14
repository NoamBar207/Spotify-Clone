import { useDispatch, useSelector } from "react-redux";
import { songService } from "../../services/song.service";
import { utilService } from "../../services/util.service";
import { setCurrSong, setIsPlaying } from "../../store/actions/station.actions";
import { ThreeDots } from "./ThreeDots";
import { SongTitleAuthor } from "./SongTitleAuthor";

export const SongToAdd = ({ isSearchYotube, song }) => {
  const { userStations } = useSelector((state) => state.stationModule);
  const dispatch = useDispatch();

  const onSelectSong = async () => {
    if (isSearchYotube) {
      dispatch(setIsPlaying(false));
      dispatch(setCurrSong(song));
      await songService.addSong(song);
    } else {
      dispatch(setIsPlaying(false));
      dispatch(setCurrSong(song));
    }
  };

  return (
    <section className="search-result" onDoubleClick={onSelectSong}>
      <div className="search-result-img">
        <img
          src={song.snippet.thumbnails.high.url}
          style={{ width: "56px", height: "56px" }}
        />
      </div>
      <SongTitleAuthor song={song} />
      <div className="actions">
        <ThreeDots song={song} userStations={userStations} />
        {/* {isSearchYotube && <div>
                    <button className="add-song-btn">Add Now</button>
                </div>} */}
      </div>
    </section>
  );
};

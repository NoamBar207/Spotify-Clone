import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { songService } from "../../services/song.service";
import { userService } from "../../services/user.service";
import { onSetLocalUser, onUpdateUser } from "../../store/actions/user.action";
import { setUserLikedSongs } from "../../store/actions/station.actions";

export const LikeButton = ({ songProp = null }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { currSong, likedStation } = useSelector(
    (state) => state.stationModule
  );
  const { currUser } = useSelector((state) => state.userModule);
  const dispatch = useDispatch();

  useEffect(() => {
    const songRecived = !songProp ? currSong : songProp;
    let isSongLiked = false;
    likedStation?.songs.forEach((song) => {
      if (song.videoId === songRecived.videoId) isSongLiked = true;
    });
    setIsLiked(isSongLiked);
  }, [currUser, likedStation]);

  const getLikedSongsUser = async (userReturned) => {
    await dispatch(setUserLikedSongs(userReturned));
  };

  const toggleLike = async (ev) => {
    ev.stopPropagation();
    const song = !songProp ? currSong : songProp;
    let userReturned = await songService.addSongToLike(song, currUser, isLiked);
    console.log(currUser);
    setIsLiked(!isLiked);
    if (Object.keys(currUser).length) {
      userReturned = await userService.updateUser(userReturned);
      await dispatch(onUpdateUser(userReturned));
    } else dispatch(onSetLocalUser(userReturned));
    await getLikedSongsUser(userReturned);
  };

  return (
    <div className="heart-symbol" style={{ cursor: "pointer" }}>
      {isLiked && (
        <span
          onClick={(ev) => {
            toggleLike(ev);
          }}
          style={{ color: "green" }}
        >
          <i className="fa-solid fa-heart"></i>
        </span>
      )}
      {!isLiked && (
        <span
          onClick={(ev) => {
            toggleLike(ev);
          }}
        >
          <i className="fa-regular fa-heart"></i>
        </span>
      )}
    </div>
  );
};

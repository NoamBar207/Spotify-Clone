import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { importService } from "../services/import-img-service";
import { songService } from "../services/song.service";
import { userService } from "../services/user.service";
import { utilService } from "../services/util.service";
import { YTService } from "../services/youtube.service";
import { LoaderSearch } from "./util.cmps/LoaderSearch";
import { SearchResults } from "./util.cmps/SearchResults";
import { AppMenu } from "./appForum/AppMenu";
import { socketService } from "../services/socket.service";
import { LoginSignUpModal } from "./util.cmps/LoginSignUpModal";

export const AppHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currUser } = useSelector((state) => state.userModule);

  const searchRef = useRef();
  const searchContainerRef = useRef();
  const userModalRef = useRef();
  const formRef = useRef();
  const menuRef = useRef();
  const location = useLocation();
  const [isOnMellofy, setIsOnMellofy] = useState(true);
  const [isSearchYotube, setIsSearchYoutube] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    addClassOnSearch();
  }, [location]);

  const handleClickOutside = (ev) => {
    if (!searchContainerRef.current.contains(ev.target)) {
      onResetInput();
      document.removeEventListener("click", handleClickOutside, true);
    }
  };

  const onSearch = (ev) => {
    ev.preventDefault();
    if (data.length) setData([]);
    let value = ev.target[0].value;
    if (value) isSearchYotube ? onSubmitYoutube(value) : onSubmitMellofy(value);
  };

  const onSubmitMellofy = async (value) => {
    let songs = await songService.query(value);
    if (songs.length) {
      setData(songs);
    } else {
      setIsOnMellofy(false);
    }
  };

  const onSubmitYoutube = async (value) => {
    // let value = ev.target[0].value
    const data = await YTService.getSongSearch(value);
    const songs = editData(data.items);
    setData(songs);
  };

  const onSearchYoutube = () => {
    setIsOnMellofy(true);
    setIsSearchYoutube(true);
  };

  useEffect(() => {
    if (!Object.keys(currUser).length) {
      getUser();
    }
  }, []);

  const getUser = async () => {
    const user = await userService.getLoggedinUser();
    if (user) {
      socketService.emit("set-user-socket", user._id);
      dispatch({
        type: "SET_USER",
        user,
      });
    }
  };

  const editData = (items) => {
    let songs = items.map((song) => {
      return songService.songEditor(song);
    });
    return songs;
  };

  const onHomeClick = () => {
    navigate("/");
  };

  const onLoginSignUp = (bool) => {
    bool ? navigate("/signup") : navigate("/login");
  };

  // const onSearchClick = () => {
  //     navigate('/search')
  // }

  // const onMenuClick = () => {
  //     utilService.toggleModal(menuRef)
  // }

  // const onLogOutModal = () => {
  //     dispatch(onLogout())
  //     dispatch(setCurrStation({}))
  //     navigate('/')
  // }

  const onResetInput = () => {
    utilService.closeModal(searchRef);
    formRef.current.reset();
    setData([]);
    setIsOnMellofy(true);
    setIsSearchYoutube(false);
  };

  const addClassOnSearch = () => {
    if (location.pathname.includes("search"))
      searchRef.current.classList.remove("hide");
    else searchRef.current.classList.add("hide");
  };

  const toggleSearchRef = () => {
    if (window.innerWidth > 480) utilService.toggleModal(searchRef);
  };

  return (
    <header className="app-header-container">
      <div className="header-logo" onClick={onHomeClick}>
        <i
          className="fa-brands fa-spotify"
          style={{ height: "33px", width: "33px" }}
        ></i>
        Mellofy
      </div>
      <div className="header-home-search">
        {/* <div className='header-home-btn' style={{backgroundImage:`URL(${importService.homePageIcon})`}}></div> */}
        <div className="header-home-btn home-btn" onClick={onHomeClick}>
          <i
            className="fa-solid fa-house"
            style={{ height: "24px", width: "24px" }}
          ></i>
        </div>
        <div
          className="header-search-container"
          ref={searchContainerRef}
          onClick={() => {
            toggleSearchRef();
            document.addEventListener("click", handleClickOutside, true);
          }}
        >
          <label className="label-search flex">
            <i
              className="fa-solid fa-magnifying-glass"
              style={{ height: "22px", width: "22px" }}
            ></i>
            <form
              className="header-search-form"
              ref={formRef}
              onSubmit={onSearch}
            >
              <input
                className="header-search"
                // onChange={handleChange}
                placeholder="What do you want to listen to?"
              />
            </form>
            <section
              className="header-search-results hide"
              onClick={(ev) => ev.stopPropagation}
              ref={searchRef}
            >
              {isSearchYotube ? (
                <h1>Add to Mellofy</h1>
              ) : (
                <h1>Search in Mellofy</h1>
              )}
              {(!isOnMellofy || !!data.length) && (
                <div className="add-to-btn">
                  <button onClick={onSearchYoutube}>
                    Could not find your song? Add it to Mellofy!
                  </button>
                </div>
              )}
              {data.length ? (
                <SearchResults items={data} isSearchYotube={isSearchYotube} />
              ) : (
                <LoaderSearch />
              )}
            </section>
          </label>
        </div>
        <div
          className="header-home-btn"
          onClick={() => utilService.toggleModal(menuRef)}
        >
          <i
            className="fa-solid fa-comments"
            style={{ height: "24px", width: "24px" }}
          ></i>
        </div>
      </div>
      {Object.keys(currUser).length ? (
        <LoginSignUpModal modalRef={userModalRef} />
      ) : (
        <div className="no-user-header">
          <button
            className="util-btn signup-header"
            onClick={() => onLoginSignUp(true)}
          >
            Sign Up
          </button>
          <button
            className="util-btn login-header"
            onClick={() => onLoginSignUp(false)}
          >
            Log in
          </button>
        </div>
      )}
      <AppMenu menuRef={menuRef} />
    </header>
  );
};

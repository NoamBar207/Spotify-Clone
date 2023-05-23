import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { utilService } from "../../services/util.service";
import { setCurrStation } from "../../store/actions/station.actions";
import { onLogout } from "../../store/actions/user.action";
import { AppMenu } from "../appForum/AppMenu";

export const LoginSignUpModal = ({ modalRef }) => {
  const { currUser } = useSelector((state) => state.userModule);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef();

  const onLoginSignUp = (bool) => {
    bool ? navigate("/signup") : navigate("/login");
  };

  const onLogOutModal = () => {
    dispatch(onLogout());
    dispatch(setCurrStation({}));
    navigate("/");
  };

  return (
    <main className="login-signup-container">
      {Object.keys(currUser).length ? (
        <section
          className="user-logo-container"
          onClick={() => utilService.toggleDisplayNone(modalRef)}
        >
          <div
            className="user-logo"
            style={{
              background: `url(${currUser.imgUrl}) center center/cover`,
              height: "28px",
              borderRadius: "15px",
              width: "28px",
            }}
          ></div>
          {window.innerWidth > 480 && currUser.username}
          <div
            className="search-result-container loggedin-modal hide-none"
            ref={modalRef}
          >
            <div className="search-result" onClick={onLogOutModal}>
              <span>
                <i className="fa-solid fa-right-from-bracket"></i>
              </span>
              Log Out
            </div>
            {/* <div className="search-result">
              <span>
                <i className="fa-solid fa-envelope"></i>
              </span>
              Notifications
            </div> */}
            <div
              className="search-result"
              onClick={() => utilService.toggleModal(menuRef)}
            >
              <span>
                <i className="fa-solid fa-comments"></i>
              </span>
              Forum
            </div>
          </div>
        </section>
      ) : (
        <>
          {window.innerWidth <= 780 && !Object.keys(currUser).length && (
            <div
              className="homepage-settings"
              onClick={() => utilService.toggleDisplayNone(modalRef)}
            >
              <span>
                <i className="fa-solid fa-gear"></i>
              </span>
            </div>
          )}
          <div className="search-result-container hide-none" ref={modalRef}>
            <div
              className="search-result"
              onClick={() => {
                onLoginSignUp(false);
              }}
            >
              <span>
                <i className="fa-solid fa-right-from-bracket"></i>
              </span>
              Log in
            </div>
            <div
              className="search-result"
              onClick={() => {
                onLoginSignUp(true);
              }}
            >
              <span>
                <i className="fa-solid fa-user-plus"></i>
              </span>
              Sign Up
            </div>
            <div
              className="search-result"
              onClick={() => utilService.toggleModal(menuRef)}
            >
              <span>
                <i className="fa-solid fa-comments"></i>
              </span>
              Forum
            </div>
          </div>
        </>
      )}
      <AppMenu menuRef={menuRef} />
    </main>
  );
};

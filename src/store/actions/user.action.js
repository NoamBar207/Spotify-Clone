import { userService } from "../../services/user.service";

export function onSignup(credentials) {
  return async (dispatch) => {
    // let newScrum = await boardService.getBoardForGuest()?
    // let newCred = {...credentials, boards:[newScrum._id], starred:[newScrum._id]}
    try {
      const user = await userService.signup(credentials);
      dispatch({
        type: "SET_USER",
        user,
      });
      dispatch({
        type: "ADD_USER",
        user,
      });
    } catch (err) {
      console.log("Cannot signup", err);
    }
  };
}

export function onLogin(credentials) {
  return async (dispatch) => {
    try {
      const user = await userService.login(credentials);
      dispatch({
        type: "SET_USER",
        user,
      });
    } catch (err) {
      throw err;
    }
  };
}

export function onLogout() {
  return async (dispatch) => {
    try {
      console.log("onLogout");
      await userService.logout();
      dispatch({
        type: "SET_USER",
        user: null,
      });
    } catch (err) {
      // showErrorMsg('Cannot logout')
      console.log("Cannot logout", err);
    }
  };
}

export function getUser() {
  return async (dispatch) => {
    try {
      let user = await userService.getLoggedinUser();
      console.log(user);
      await dispatch({
        type: "SET_USER",
        user,
      });
    } catch (err) {
      console.log("Cannot SET USER", err);
    }
  };
}

export function onUpdateUser(user) {
  return async (dispatch) => {
    try {
      // userService.saveLocalUser(user)
      dispatch({ type: "SET_USER", user });
    } catch (err) {
      console.log("cannot update user", err);
    }
  };
}

export function onSetLocalUser(user) {
  return async (dispatch) => {
    try {
      dispatch({ type: "SET_LOCAL_USER", user });
    } catch (err) {
      console.log("cannot set local user", err);
    }
  };
}

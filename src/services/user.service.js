import { httpService } from "./http.service";
import { socketService, SOCKET_EMIT_UPDATE_USER } from "./socket.service";
import { utilService } from "./util.service";

const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser";

export const userService = {
  signup,
  logout,
  saveLocalUser,
  getLoggedinUser,
  getById,
  updateUser,
  login,
  getUsers,
  toggleStationToUser,
};

async function getLoggedinUser() {
  return await JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}

async function signup(userCred) {
  const user = await httpService.post("auth/signup", userCred);
  return saveLocalUser(user);
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
  return await httpService.post("auth/logout");
}

async function login(userCred) {
  const user = await httpService.post("auth/login", userCred);
  if (user) {
    socketService.emit("set-user-socket", user._id);
    return saveLocalUser(user);
  } else {
    console.log("NEED TO SIGN IN !");
    throw new Error("service");
  }
}

async function updateUser(user) {
  const userToSave = await httpService.put(`user/${user._id}`, user);
  return saveLocalUser(userToSave);
}

async function getUsers() {
  const users = await httpService.get("user/users");
  const loggedinUser = await getLoggedinUser();
  return loggedinUser ? users.filter((u) => u._id !== loggedinUser._id) : users;
  // const res =
  // return res
}

async function toggleStationToUser(user, stationId) {
  const isInclude = !!user.followedStations.find((id) => id == stationId);
  const newArr = utilService.removeOrAdd(
    user.followedStations,
    stationId,
    isInclude
  );
  user.followedStations = newArr;
  await httpService.put(`user/${user._id}`, user);
  socketService.emit("user-update", user);
}

async function getById(userId) {
  const user = await httpService.get(`user/${userId}`);
  return user;
}

function saveLocalUser(user) {
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
  return user;
}

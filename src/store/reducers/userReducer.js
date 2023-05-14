const INITIAL_STATE = {
  currUser: {},
  localUser: {},
  users: [],
};
export function userReducer(state = INITIAL_STATE, action) {
  var newState = state;
  var users = state.users;
  switch (action.type) {
    case "SET_USER":
      return (newState = { ...state, currUser: { ...action.user } });

    case "SET_LOCAL_USER":
      return (newState = { ...state, localUser: { ...action.user } });

    case "REMOVE_USER":
      newState = {
        ...state,
        users: state.users.filter((user) => user._id !== action.userId),
      };
      break;

    case "SET_USERS":
      return (newState = { ...state, users: action.users });

    case "SAVE_USER":
      users = state.users.map((user) =>
        user._id === action.user._id ? { ...action.user } : user
      );
      return (newState = { ...state, users });

    case "ADD_USER":
      newState = { ...state, users: [...users, action.user] };

    default:
      return state;
  }

  return newState;
}

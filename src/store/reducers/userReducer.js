const INITIAL_STATE = {
	currUser: {},
	users: [],
}
export function userReducer(state = INITIAL_STATE, action) {
	var newState = state
	var users = state.users
	switch (action.type) {
		case 'SET_USER':
			return (newState = { ...state, currUser: { ...action.user } })
			break

		case 'REMOVE_USER':
			newState = { ...state, users: state.users.filter((user) => user._id !== action.userId), }
			break
		case 'SET_USERS':
			return (newState = { ...state, users: action.users })
			break
		case 'SAVE_USER':
			users = state.users.map((user) => user._id === action.user._id ? { ...action.user } : user)
			return (newState = { ...state, users })
			break
		case 'ADD_USER':
			newState = { ...state, users: [...users, action.user] }
			break

		default:
			return state
	}

	return newState
}
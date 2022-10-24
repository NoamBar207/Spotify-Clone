import {httpService} from './http.service'


const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    signup,
    logout,
    saveLocalUser,
	getLoggedinUser,
	login
}

async function getLoggedinUser() {
	return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

async function signup(userCred) {
	const user = await httpService.post('auth/signup', userCred)
	return saveLocalUser(user)
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
	
}

async function login(userCred) {

	const user = await httpService.post('auth/login', userCred)
	if (user) {
		return saveLocalUser(user)
	} else {
		console.log('NEED TO SIGN IN !')
		throw new Error('service')
	}
}

function saveLocalUser(user) {
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}
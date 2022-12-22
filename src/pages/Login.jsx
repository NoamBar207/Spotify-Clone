import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { onLogin, onSignup } from "../store/actions/user.action"
import jwt_decode from "jwt-decode"

const googleLoginKey = '191073475183-96e548l2ufak98s6fpsfoh888ftbm7pp.apps.googleusercontent.com'



export const Login = () => {


	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [isError, setIsError] = useState('')

	const [credentials, setCredentials] = useState({
		username: '',
		password: '',
		email:''
	})


	useEffect(() => {
		/* global google */
		google.accounts.id.initialize({
			client_id: googleLoginKey,
			callback: handleCallbackResponse
		})

		google.accounts.id.renderButton(
			document.getElementById('google-login-div'),
			{theme:'outline', size:'large'}
		)
	}, [])

	const handleCallbackResponse = (response) => {
		console.log("Encoded JWT Id token :  " + response.credential);
		let decodeInfo = jwt_decode(response.credential)
		console.log(decodeInfo);
		dispatch(onLogin({...credentials , username:decodeInfo.name, email:decodeInfo.email}))
		navigate('/')
	}

	const handleChange = (ev) => {
		let field = ev.target.name
		let value = ev.target.value
		setCredentials({ ...credentials, [field]: value })
	}

	const onLoginUser = async () => {
		if (
			!credentials.username.length ||
			!credentials.password.length
			// !credentials.fullname.length
		) return console.log('empty fields')
		dispatch(onLogin(credentials))
		// let newScrum = await boardService.getBoardForGuest()
		// let newUser = { ...credentials, boards: [newScrum._id], starred: [newScrum._id] }
		// newUser = await userService.update(newUser)
		// await userService.saveLocalUser(newUser)
		// dispatch(setCurrUser(newUser))
		resetCredentials()
		navigate(`/`)
	}

	const handleError = () => {
		setIsError('show')
		setTimeout(setIsError, 2000, '')
	}

	const resetCredentials = () => {
		setCredentials({
			username: '',
			password: '',
			email: ''
		})
	}

	return (
		<section className="sign-up-container">
			<header className="sign-up-header">
				<span><i class="fa-brands fa-spotify" style={{ height: '56px', width: '56px' }}></i> Mellofy</span>
			</header>
			<section className="sign-up-main">
				<h1 style={{ fontSize: '24px' }}>Sign up for free to start listening.</h1>
				<section className="sign-up-platforms">
					<button className="util-btn facebook">CONTINUE WITH FACEBOOK</button>
					{/* <button className="util-btn apple">continue with apple</button> */}
					{/* <button className="util-btn google">CONTINUE WITH GOOGLE</button> */}
					<div id='google-login-div'></div>
				</section>
				<span className='sign-up-or'><hr /><span>or</span><hr /></span>
				{/* <h3>What's your name?</h3>
				<input
					type="text"
					name="fullname"
					value={credentials.fullname}
					placeholder="Fullname"
					onChange={handleChange}
					required
				/> */}
				<h3>UserName</h3>
				<input
					type="text"
					name="username"
					value={credentials.username}
					placeholder="Username"
					onChange={handleChange}
					required
				/>
				<h3>Password</h3>
				<input
					type="password"
					name="password"
					value={credentials.password}
					placeholder="Password"
					onChange={handleChange}
					required
				/>
				<button className="signup-btn util-btn" onClick={onLoginUser}>Login</button>
			</section>
		</section>
	)
}
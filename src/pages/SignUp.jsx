import { useState } from "react"
import { useDispatch } from "react-redux"
import { uploadService } from "../services/upload.service"
import { onSignup } from "../store/actions/user.action"
import { importService } from "../services/import-img-service"
import { useNavigate } from "react-router-dom"

export const SignUp = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()


	const [credentials, setCredentials] = useState({
		fullname: '',
		username: '',
		password: '',
		stations:[],
		imgUrl: ''
	})

	const handleChange = async (ev) => {
		let field
		let value
		if (ev.target.type === 'file') {
			field = 'imgUrl'
			let tempVal = await uploadService.uploadImg(ev)
			value = tempVal.url
		}
		else {
			field = ev.target.name
			value = ev.target.value
		}
		setCredentials({ ...credentials, [field]: value })
	}

	const onSignUpNewUser = async () => {
		if(
			!credentials.username.length ||
			!credentials.password.length ||
			!credentials.fullname.length
		) return console.log('empty fields')
		await dispatch(onSignup(credentials))
		// let newScrum = await boardService.getBoardForGuest()
		// let newUser = { ...credentials, boards: [newScrum._id], starred: [newScrum._id] }
		// newUser = await userService.update(newUser)
		// await userService.saveLocalUser(newUser)
		// dispatch(setCurrUser(newUser))

		setCredentials({
			username: '',
			password: '',
			fullname: '',
			stations:[],
			imgUrl: ''
		})
		navigate(`/`)
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
					<button className="util-btn google">CONTINUE WITH GOOGLE</button>
				</section>
				<span className='sign-up-or'><hr /><span>or</span><hr /></span>
				<h1 className="sign-up-title">Sign up with your email address</h1>
				<h3>What's your name?</h3>
				<input
					type="text"
					name="fullname"
					value={credentials.fullname}
					placeholder="Fullname"
					onChange={handleChange}
					required
				/>
				<h3>How should we call you?</h3>
				<input
					type="text"
					name="username"
					value={credentials.username}
					placeholder="Username"
					onChange={handleChange}
					required
				/>
				<h3>Create a password</h3>
				<input
					type="password"
					name="password"
					value={credentials.password}
					placeholder="Password"
					onChange={handleChange}
					required
				/>
				<label className="file-label" >
					<img className="upload-img" src={importService.uploadSvg} />
					<span className="file-label-txt">Upload a profile picture</span>
					<input
						className="file-input"
						type="file"
						name="imgUrl"
						value={credentials.img}
						onChange={handleChange}
						style={{ visibility: "hidden" }}
					/></label>

				<button className="signup-btn util-btn" onClick={onSignUpNewUser}>Sign Up</button>
			</section>
		</section>

	)
}
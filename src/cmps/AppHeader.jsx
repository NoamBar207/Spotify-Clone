import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { importService } from '../services/import-img-service';
import { songService } from '../services/song.service';
import { stationService } from '../services/station.service';
import { userService } from '../services/user.service';
import { utilService } from '../services/util.service';
import { YTService } from '../services/youtube.service';
import { setCurrStation } from '../store/actions/station.actions';
import { getUser, onLogout } from '../store/actions/user.action';
import { LoaderSearch } from './util.cmps/LoaderSearch';
import { SearchResults } from './util.cmps/SearchResults';




export const AppHeader = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currUser } = useSelector((state) => state.userModule)

    const searchRef = useRef()
    const userModalRef = useRef()
    const [isOnMellofy, setIsOnMellofy] = useState(true)
    const [isSearchYotube, setIsSearchYoutube] = useState(false)
    const [data, setData] = useState([])


    const onSearch = (ev) => {
        ev.preventDefault()
        console.log(ev.target[0].value)
        if (data.length) setData([])
        let value = ev.target[0].value
        isSearchYotube ? onSubmitYoutube(value) : onSubmitMellofy(value)
    }

    const onSubmitMellofy = async (value) => {
        let songs = await songService.query(value)
        if (songs.length) {
            setData(songs)
        } else {
            setIsOnMellofy(false)
        }
    }

    const onSubmitYoutube = async (value) => {
        // let value = ev.target[0].value
        const data = await YTService.getSongSearch(value)
        const songs = editData(data.items)
        setData(songs)
    }

    const onSearchYoutube = () => {
        setIsOnMellofy(true)
        setIsSearchYoutube(true)
    }

    useEffect(() => {
        if (!Object.keys(currUser).length) {
            getUser()
        }

    }, [])

    const getUser = async () => {
        const user = await userService.getLoggedinUser()
        if (user) dispatch({
            type: 'SET_USER',
            user,
        })
    }

    const editData = (items) => {
        let songs = items.map(song => {
            return songService.songEditor(song)
        })
        return songs
    }

    const onHomeClick = () => {
        navigate('/')
    }

    const onSearchClick = () => {
        navigate('/search')
    }

    const onLoginSignUp = (bool) => {
        bool ? navigate('/signup') : navigate('/login')
    }

    const onLogOutModal = () => {
        dispatch(onLogout())
        dispatch(setCurrStation({}))
        navigate('/')
    }

    return (
        <header className="app-header-container">
            <div className="header-logo" onClick={onHomeClick}>
                <i className="fa-brands fa-spotify" style={{ height: '33px', width: '33px' }}></i>
                Mellofy
            </div>
            <div className="header-home-search" >
                {/* <div className='header-home-btn' style={{backgroundImage:`URL(${importService.homePageIcon})`}}></div> */}
                <div className='header-home-btn' onClick={onHomeClick} ><i class="fa-solid fa-house" style={{ height: '24px', width: '24px' }}></i></div>
                <div className='header-search-container' onClick={() => utilService.toggleModal(searchRef)}>
                    <label className="label-search flex">
                        <i className="fa-solid fa-magnifying-glass" style={{ height: '22px', width: '22px' }}></i>
                        <form className='header-search-form' onSubmit={onSearch}>
                            <input
                                className="header-search"
                                // onChange={handleChange}
                                placeholder="What do you want to listen to?"
                            />
                        </form>
                        <section className='header-search-results hide' onClick={ev => ev.stopPropagation} ref={searchRef}>
                            {isSearchYotube ? <h1>Add to Mellofy</h1> : <h1>Search in Mellofy</h1>}
                            {data.length ? <SearchResults items={data} isSearchYotube={isSearchYotube} /> : <LoaderSearch />}
                            {!isOnMellofy | data.length && <div className='add-to-btn'>
                                <button onClick={onSearchYoutube}>Could not find your song? Add it to Mellofy!</button>
                            </div>}
                        </section>
                    </label>
                </div>
            </div>
            {Object.keys(currUser).length ? <div className='user-logo-container' onClick={() => utilService.toggleModal(userModalRef)}>
                <div className="user-logo"
                    style={{
                        background: `url(${currUser.imgUrl}) center center/cover`,
                        height: '28px',
                        borderRadius: '15px',
                        width: '28px'
                    }}></div>
                {currUser.username}
                <section className='search-result-container hide' ref={userModalRef} onClick={(ev) => ev.stopPropagation()}>
                    <div className='search-result' onClick={onLogOutModal}><span><i className="fa-solid fa-right-from-bracket"></i></span>Log Out</div>
                    <div className='search-result'><span><i className="fa-solid fa-envelope"></i></span>Notifications</div>
                </section>
            </div> :
                <div className='no-user-header'>
                    <button className='util-btn signup-header' onClick={() => onLoginSignUp(true)}>Sign Up</button>
                    <button className='util-btn login-header' onClick={() => onLoginSignUp(false)}>Log in</button>
                </div>
            }
            {/* <div className="user-icon"> */}
            {/* user Icon */}
            {/* </div> */}
        </header>
    )
}


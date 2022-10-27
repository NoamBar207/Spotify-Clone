import { width } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { importService } from '../services/import-img-service';
import { stationService } from '../services/station.service';
import { userService } from '../services/user.service';
import { YTService } from '../services/youtube.service';



export const AppHeader = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currUser } = useSelector((state) => state.userModule)

    const searchRef = useRef()
    const [searchString, setSearchString] = useState('')

    const onSubmitYoutube = (ev) => {
        ev.preventDefault()
        console.log(ev.target[0].value);
        let value = ev.target[0].value
        YTService.getSongSearch(value)
    }

    const handleChange = async (ev) => {
        let value
        value = ev.target.value
        setSearchString(value)
    }

    useEffect(() => {
        if (!Object.keys(currUser).length) {
            getUser()
        }

    }, [currUser])

    const getUser = async () => {
        const user = await userService.getLoggedinUser()
        if (Object.keys(user).length) dispatch({
            type: 'SET_USER',
            user,
        })
    }

    const toggleModal = async (refType) => {
        try {
            refType.current.classList.toggle('hide')
            // const templates = await boardService.queryTemplates()
            // setTemplates(templates)
        } catch (err) {
            console.log('cannot get templates', err);
        }
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


    return (
        <header className="app-header-container">
            <div className="header-logo" onClick={onHomeClick}>
                <i class="fa-brands fa-spotify" style={{ height: '33px', width: '33px' }}></i>
                Mellofy
            </div>
            <div className="header-home-search" >
                {/* <div className='header-home-btn' style={{backgroundImage:`URL(${importService.homePageIcon})`}}></div> */}
                <div className='header-home-btn' onClick={onHomeClick} ><i class="fa-solid fa-house" style={{ height: '24px', width: '24px' }}></i></div>
                <div className='header-search-container' onClick={() => toggleModal(searchRef)}>
                    <label className="label-search flex">
                        <i className="fa-solid fa-magnifying-glass" style={{ height: '22px', width: '22px' }}></i>
                        <form className='header-search-form'>
                            <input
                                className="header-search"
                                // onChange={onSearchBoard}
                                onClick={onSearchClick}
                                placeholder="What do you want to listen to?"
                            />
                        </form>
                        <section className='header-search-results hide' ref={searchRef}>
                            Hey From Modal

                        </section>
                    </label>
                </div>
            </div>
            {Object.keys(currUser).length ? <div className='user-logo-container'>
                <div
                    className="user-logo"
                    style={{
                        background: `url(${currUser.imgUrl}) center center/cover`,
                        height: '28px',
                        borderRadius: '15px',
                        width: '28px'
                    }}></div>
                {currUser.username}
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


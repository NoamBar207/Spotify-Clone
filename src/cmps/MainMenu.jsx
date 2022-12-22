import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { importService } from "../services/import-img-service"
import { userService } from "../services/user.service"
import { stationService } from "../services/station.service"
import { getUser, onUpdateUser } from "../store/actions/user.action"
import { onSetUserStations, setCurrStation, setFollowedStations, setLikedSongsUser, setUserStation } from "../store/actions/station.actions"
import { socketService, SOCKET_EMIT_UPDATE_USER, SOCKET_ON_UPDATE_USER } from "../services/socket.service"


export const MainMenu = () => {
    const { currUser } = useSelector((state) => state.userModule)
    const { userStations, currStation, likedStation, followedStations } = useSelector((state) => state.stationModule)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userStationState, setUserStationState] = useState([])
    // useEffect(() => {
    //     if (!Object.keys(currUser).length) {
    //         dispatch(getUser())
    //     }
    // }, [])

    useEffect(() => {
        socketService.off('update-user')
        socketService.off('update-station')

        socketService.on('update-user', (user) => {
            dispatch(onUpdateUser(user))
        })

        socketService.on('update-station', station => {
            getUserOnMenu() .then((res)=>{
                console.log(res);
                res.followedStations.forEach(stationId => {
                    if (stationId === station._id) dispatch(onUpdateUser({...res}))
                })
            })
        })

        return () => {
            socketService.off('update-user')
            socketService.off('update-station')
        }
    }, [])

    useEffect(() => {
        asyncSet()
    }, [currStation, currUser])

    const asyncSet = async () => {
        await dispatch(onSetUserStations(currUser))
        await loadUserStations()
        await getLikedSongsUser()
        onSetFollowedStations()
    }

    const getUserOnMenu = async () => {
        const res = await userService.getLoggedinUser()
        return res
    }

    const getLikedSongsUser = async () => {
        await dispatch(setLikedSongsUser(currUser))
    }

    const loadUserStations = async () => {
        if (currUser.stations?.length) {
            try {
                let userStations = await Promise.all(
                    currUser.stations.map(async (id) => {
                        const station = await stationService.getById(id)
                        return station
                    })
                )
                setUserStationState(userStations)
            } catch (err) {
                console.log('Cannot Load user Stations ', err);
            }
        }
        else return
    }


    const getUserComp = async () => {
        // const user = await userService.getLoggedinUser()
        // if (Object.keys(user).length) 
        // await dispatch({
        //     type: 'SET_USER',
        //     user,
        // })
        await dispatch(getUser())
        console.log('get user ', currUser);
    }

    const onSetFollowedStations = async () => {
        // const userStations = await stationService.loadUserStations(currUser.stations)
        // var stations = await httpService.get(STORAGE_KEY)
        if (currUser.followedStations.length) {
            try {
                let followedStations = await Promise.all(
                    currUser.followedStations.map(async (id) => {
                        const station = await stationService.getById(id)
                        return station
                    })
                )
                dispatch(setFollowedStations([...followedStations]))
            } catch (err) {
                console.log('Cannot Load shared Stations ', err);
            }
        }
        else dispatch(setFollowedStations([]))
    }


    const socketUser = async (user) => {
        // if (!Object.keys(currUser).length) {
        //     getUserComp()
        //     console.log('no User', currUser);
        // }
        console.log(currUser, 'socket func');
        if (user._id === currUser._id) {
            // socketUser(user)
            console.log('curr after change', currUser)
            onSetFollowedStations()
        }
        await userService.saveLocalUser(user)
        dispatch(onUpdateUser(user))
    }

    const onCreateStation = async () => {
        if (!!currUser) {
            const newUser = await stationService.createNewStation(currUser)
            await dispatch(onUpdateUser(newUser))
            console.log(newUser);
            const index = newUser.stations.length - 1
            const station = await stationService.getById(newUser.stations[index])
            console.log(station);
            await dispatch(setCurrStation(station))
            navigate(`/station/${station._id}`)
        }
    }

    const onPlaylistPick = async (station) => {
        await dispatch(setCurrStation(station))
        station.name === 'Liked Songs' ?
            navigate('/station/likedsong') :
            navigate(`/station/${station._id}`)
    }


    return (
        <section className="main-menu-container">
            {/* <h1>Hello From Menu</h1> */}
            {/* <Link className="menu-link"><img className="menu-pic" src={importService.homePageIcon} style={{ height: '24px', width: '24px' }} />Home</Link> */}
            {/* <Link className="menu-link"><img src={importService.searchIcon} style={{ height: '24px', width: '24px' }}/>Search</Link> */}
            {/* <Link className="menu-link"><i className="fa-solid fa-magnifying-glass" style={{height:'22px',width:'22px'}}></i>Search</Link> */}
            <Link className="menu-link"><i className="fa-solid fa-book" style={{ color: 'white', height: '24px', width: '24px' }}></i>Your Library</Link>
            <Link className="menu-link" onClick={onCreateStation}><div className="menu-create-playlist" ><i class="fa-solid fa-plus" style={{ color: 'black' }}></i></div>Create Playlist</Link>
            <Link className="menu-link" onClick={() => onPlaylistPick(likedStation)}><img src={importService.likedSongs} style={{ height: '24px', width: '24px' }} />Liked Songs</Link>
            {/* {Object.keys(currUser?.stations).length && */}
            {!!Object.keys(userStations).length && <>
                <hr />
                {/* <div className="user-stations">
                    {userStations.map(station => {
                        return <Link className="menu-link" onClick={() => onPlaylistPick(station)}>{station.name}</Link>
                    })}
                </div> */}
                <div className="user-stations">
                    <div className="menu-stations-title">Your Playlists:</div>
                    {!!userStationState?.length && userStationState.map(station => {
                        return <Link className="menu-link" onClick={() => onPlaylistPick(station)}>{station.name}</Link>
                    })}
                </div>
            </>
            }
            {!!followedStations.length && <>
                <hr />
                <div className="user-stations">
                    <div className="menu-stations-title">Shared Playlist:</div>
                    {!!followedStations?.length && followedStations.map(station => {
                        return <Link className="menu-link" onClick={() => onPlaylistPick(station)}>{station.name}</Link>
                    })}
                </div>
            </>
            }
            {/* } */}
        </section>
    )
}
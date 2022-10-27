import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { importService } from "../services/import-img-service"
import { userService } from "../services/user.service"
import { stationService } from "../services/station.service"
import { onUpdateUser } from "../store/actions/user.action"
import { setCurrStation, setUserStation } from "../store/actions/station.actions"


export const MainMenu = () => {


    const { currUser } = useSelector((state) => state.userModule)
    const { userStations } = useSelector((state) => state.stationModule)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // useEffect(() => {
    //     if (!Object.keys(currUser).length) {
    //         getUser()
    //     }
    // }, [currUser])

    // const getUser = async () => {
    //     const user = await userService.getLoggedinUser()
    //     if (Object.keys(user).length) dispatch({
    //         type: 'SET_USER',
    //         user,
    //     })
    // }
    useEffect(() => {
        onSetUserStations()
    }, [currUser])


    const onSetUserStations = async () => {
        // const userStations = await stationService.loadUserStations(currUser.stations)
        // var stations = await httpService.get(STORAGE_KEY)
        if (Object.keys(currUser?.stations).length) {
            try {
                console.log(currUser.stations);
                let userStations = await Promise.all(
                    currUser.stations.map(async (id) => {
                        const station = await stationService.getById(id)
                        return station
                    })
                )
                console.log(userStations);
               dispatch(setUserStation(userStations))
            } catch (err) {
                console.log('Cannot Load user Stations ', err);
            }
        }
    }

    const onCreateStation = () => {
        const newUser = stationService.createNewStation()
        dispatch(onUpdateUser(newUser))
    }

    
    const onPlaylistPick = async (station) => {
        await dispatch(setCurrStation(station))
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
            <Link className="menu-link"><img src={importService.likedSongs} style={{ height: '24px', width: '24px' }} />Liked Songs</Link>
            <hr />
            {/* {Object.keys(currUser?.stations).length && */}
             <div className="user-stations">
                {userStations.map(station => {
                    return <Link className="menu-link" onClick={()=>onPlaylistPick(station)}>{station.name}</Link>
                })}
            </div>
            {/* } */}
        </section>
    )
}
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { importService } from "../services/import-img-service"
import { userService } from "../services/user.service"


export const MainMenu = () => {


    const { currUser } = useSelector((state) => state.userModule)
    const { userStations } = useSelector((state) => state.stationModule)
    const dispatch = useDispatch()


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
        console.log(userStations);
    })

    return (
        <section className="main-menu-container">
            {/* <h1>Hello From Menu</h1> */}
            {/* <Link className="menu-link"><img className="menu-pic" src={importService.homePageIcon} style={{ height: '24px', width: '24px' }} />Home</Link> */}
            {/* <Link className="menu-link"><img src={importService.searchIcon} style={{ height: '24px', width: '24px' }}/>Search</Link> */}
            {/* <Link className="menu-link"><i className="fa-solid fa-magnifying-glass" style={{height:'22px',width:'22px'}}></i>Search</Link> */}
            <Link className="menu-link"><i className="fa-solid fa-book" style={{ color: 'white', height: '24px', width: '24px' }}></i>Your Library</Link>
            <Link className="menu-link"><div className="menu-create-playlist"><i class="fa-solid fa-plus" style={{ color: 'black' }}></i></div>Create Playlist</Link>
            <Link className="menu-link"><img src={importService.likedSongs} style={{ height: '24px', width: '24px' }} />Liked Songs</Link>
            <hr />
            {Object.keys(userStations).length && <div className="user-stations">
                {userStations.map(station =>{
                    return <Link className="menu-link">{station.name}</Link>
                })}
            </div>}
        </section>
    )
}
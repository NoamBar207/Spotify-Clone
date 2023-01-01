import { useSelector } from "react-redux"
import { CardCmp } from "../cmps/util.cmps/CardCmp"



export const LibraryPage = () => {

    const { currUser } = useSelector((state) => state.userModule)
    const { userStations, likedStation, followedStations } = useSelector((state) => state.stationModule)


    return <section className="library-page-container">
        <h1>Your Playlists</h1>
        <div className="library-grid-container">
            {!!Object.keys(likedStation).length && <div className="library-liked-card"><CardCmp station={likedStation} /></div>}
            {!!Object.keys(userStations).length && userStations.map(station => <CardCmp station={station} />)}
        </div>
        <h1>Followed Stations</h1>
        <div className="library-grid-container">
            {!!Object.keys(followedStations).length && followedStations.map(station => <CardCmp station={station} />)}
        </div>
    </section>
}
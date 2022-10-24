import { useSelector } from "react-redux"



export function StationHeader() {


    const { currStation } = useSelector((state) => state.stationModule)


    return (
        <section className="station-header-container">
            <div className="station-header-img">
                <img src={currStation.stationImg} alt="" style={{ height: '232px', width: '232px' }} />
            </div>
            <div className="station-header-deatails">
                <h1 className="playlist">PLAYLIST</h1>
                <h1 className="station-header">
                    {/* station name */}
                    {currStation.name}
                </h1>
                <div className="user-info">
                    <div>
                        <div className="header-station-user-logo"></div>
                        {currStation.songs.length}
                    </div>
                </div>
            </div>
        </section>
    )
}
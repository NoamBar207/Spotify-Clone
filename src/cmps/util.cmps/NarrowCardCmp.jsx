


export function NarrowCardCmp({station}) {

    return (
        <div className="narrow-card-container">
            <div className="narrow-card-img" style={{ background:`url(${station.stationImg}) center center/cover` }} />
            <h3>{station.name}</h3>
            <div className="play-btn-narrow-card">
                <span><i className="fa-solid fa-circle-play" style={{ width: '56px', height: '56px', color: '#1fdf64' }}></i></span>
            </div>
        </div>
    )
}
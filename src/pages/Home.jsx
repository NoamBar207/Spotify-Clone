import { useEffect, useState } from "react"
import { stationService } from '../services/station.service'
import React from 'react';

const YOTUBE_SOURCE = 'https://www.youtube.com/embed/'
const YOUTUBE_ID = 'XXYlFuWEuKI'

export function Home() {

    const [stations, setStation] = useState([])

    useEffect(() => {
        loadStation()
    }, [])



    const loadStation = async () => {
        try {
            const stations = await stationService.query()
            setStation(stations)
        } catch {
            console.error('cannot load Stations')
        }
    }

    return (
        <section className="homepage">
            <h1>Hello Spotify</h1>
            <section className="playlists-homepage-container">
                <h1>
                    {stations.map(station => {
                        return (
                            <div className="playlist-prev-container">
                                {/* {console.log(station.songs[0])} */}
                                <img src={station.songs[0].snippet.thumbnails.default.url} />
                                <iframe width="15" height="15"
                                    src={YOTUBE_SOURCE+YOUTUBE_ID}>
                                </iframe>
                                <h1>{station.name}</h1>
                            </div>
                        )
                    })}
                </h1>
            </section>
        </section>
    )
}
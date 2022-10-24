import { useEffect, useState } from "react"
import { stationService } from '../services/station.service'
import React from 'react';
import { CardCmp } from "../cmps/util.cmps/CardCmp";
import { useNavigate } from "react-router-dom";
import { NarrowCardCmp } from "../cmps/util.cmps/NarrowCardCmp";

const YOTUBE_SOURCE = 'https://www.youtube.com/embed/'
const YOUTUBE_ID = 'XXYlFuWEuKI'

export function HomePage() {

    const [stations, setStation] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        loadStations()
        getGreetingTitle()
    }, [])



    const loadStations = async () => {
        try {
            const stations = await stationService.query()
            setStation(stations)
        } catch {
            console.error('cannot load Stations')
        }
    }

    const getGreetingTitle = () => {
        let time = new Date()
        time = time.getHours()
        if (5 <= time && time < 12) {
            return "Good Morning"
        } else if (12 <= time && time < 20) {
            return "Good Afternoon"
        } else if (20 <= time && time < 24) {
            return "Good Evening"
        }
        else return "Good Night"
    }

    return (
        <section className="homepage-container">
            <div className="homepage-greet">
                <h2>{getGreetingTitle()}</h2>
                <div className="narrow-card-grid">
                    {stations.map(station => <NarrowCardCmp station={station} />)}
                </div>
            </div>
            <section className="homepage-playlists">
                <div className="homepage-playlists-title">
                    <h2>Playlist you might like</h2>
                </div>
                <div className="homepage-playlists-grid">
                    {Object.keys(stations).length ? stations.map(station => {
                        return <CardCmp station={station} />
                    })
                        : <></>}
                </div>
            </section>
        </section>
    )
}
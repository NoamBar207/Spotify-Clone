import { useEffect, useState } from "react"
import { stationService } from '../services/station.service'
import React from 'react';
import { CardCmp } from "../cmps/util.cmps/CardCmp";
import { useNavigate } from "react-router-dom";
import { NarrowCardCmp } from "../cmps/util.cmps/NarrowCardCmp";
import { YTService } from "../services/youtube.service";

const YOTUBE_SOURCE = 'https://www.youtube.com/embed/'
const YOUTUBE_ID = 'XXYlFuWEuKI'

export function HomePage() {

    const [stations, setStation] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        loadStations()
        getGreetingTitle()
    }, [])

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
        else if (0 <= time && time < 5) return "Good Night"
    }

    return (
        <section className="homepage-container">
            <div className="homepage-greet">
                <h2>{getGreetingTitle()}</h2>
                <div className='home-search-container'>
                    <label className="label-search flex">
                        <i className="fa-solid fa-magnifying-glass" style={{ height: '22px', width: '22px' }}></i>
                        <form onSubmit={onSubmitYoutube}>
                            <input
                                onChange={handleChange}
                                // onClick={}
                                className="header-search"
                                placeholder="What do you want to listen to?"
                            />
                        </form>
                    </label>
                </div>
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
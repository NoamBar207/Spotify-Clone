import { useEffect, useState } from "react";
import { stationService } from "../services/station.service";
import React from "react";
import { CardCmp } from "../cmps/util.cmps/CardCmp";
import { NarrowCardCmp } from "../cmps/util.cmps/NarrowCardCmp";
import { useSelector } from "react-redux";

import { useRef } from "react";
import { LoginSignUpModal } from "../cmps/util.cmps/LoginSignUpModal";

export function HomePage() {
  const { currUser } = useSelector((state) => state.userModule);
  const { likedStation } = useSelector((state) => state.stationModule);
  const [stations, setStation] = useState([]);
  const settingsRef = useRef();

  useEffect(() => {
    loadStations();
    getGreetingTitle();
  }, []);

  const loadStations = async () => {
    try {
      const stations = await stationService.query();
      setStation(stations);
    } catch {
      console.error("cannot load Stations");
    }
  };

  const getGreetingTitle = () => {
    let time = new Date();
    time = time.getHours();
    if (5 <= time && time < 12) {
      return "Good Morning";
    } else if (12 <= time && time < 20) {
      return "Good Afternoon";
    } else if (20 <= time && time < 24) {
      return "Good Evening";
    } else if (0 <= time && time < 5) return "Good Night";
  };

  return (
    <section className="homepage-container">
      <div className="homepage-greet">
        <div className="homepage-greet-settings">
          <h2>{getGreetingTitle()}</h2>

          {window.innerWidth <= 780 && (
            <LoginSignUpModal modalRef={settingsRef} />
          )}
        </div>
        <div className="narrow-card-grid">
          <NarrowCardCmp station={likedStation} key="likedSongs" />
          {stations.map((station) => {
            if (station.renderType === "byGanere")
              return <NarrowCardCmp station={station} key={station._id} />;
          })}
        </div>
      </div>
      <section className="homepage-playlists">
        <div className="homepage-playlists-title">
          <h2>Playlist By Ganere</h2>
        </div>
        <div className="homepage-playlists-grid">
          {Object.keys(stations).length ? (
            stations.map((station) => {
              if (station.renderType === "byGanere")
                return <CardCmp station={station} key={station._id} />;
            })
          ) : (
            <></>
          )}
        </div>
      </section>
      <section className="homepage-playlists">
        <div className="homepage-playlists-title">
          <h2>Playlist By Artists</h2>
        </div>
        <div className="homepage-playlists-grid">
          {Object.keys(stations).length ? (
            stations.map((station) => {
              if (station.renderType === "byArtist")
                return <CardCmp station={station} key={station._id} />;
            })
          ) : (
            <></>
          )}
        </div>
      </section>
      <section className="homepage-playlists">
        <div className="homepage-playlists-title">
          <h2>Playlist By Mood</h2>
        </div>
        <div className="homepage-playlists-grid">
          {Object.keys(stations).length ? (
            stations.map((station) => {
              if (station.renderType === "byMood")
                return <CardCmp station={station} key={station._id} />;
            })
          ) : (
            <></>
          )}
        </div>
      </section>
    </section>
  );
}

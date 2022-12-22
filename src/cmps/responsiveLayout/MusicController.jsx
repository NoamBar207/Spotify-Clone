import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import YouTube from "react-youtube"
import { LikeButton } from "../util.cmps/LikeButton"



// export const MusicController = () => {
//     const { currSong, isPlaying, currStation, isShuffeld } = useSelector((state) => state.stationModule)
//     const dispatch = useDispatch()



//     const opts = {
//         height: '00',
//         width: '00',
//         playerVars: {
//             // https://developers.google.com/youtube/player_parameters
//             autoplay: 1,
//         }
//     }


//     const playerReady = (event) => {
//         //cleaning
//         clearInterval(intervalId.current)
//         setSongDuration(0)
//         titleSplitter()
//         event.target.playVideo()

//         //setters
//         dispatch(setIsPlaying(true))
//         dispatch(setPlayer(event.target))
//         setSongTotalDuration(utilService.getSongDurationToMin(+event.target.getDuration()))
//         setSongTotalDurationNum(+event.target.getDuration())
//     }

//     const playerOnPlay = () => {
//         // if (songDuration) {
//         //     console.log(songDuration, 'heree58');
//         //     player.seekTo(50)
//         // }
//         clearInterval(intervalId.current)
//         intervalId.current = setInterval(() => {
//             setSongDuration(prevDuration => +prevDuration + 1)
//         }, 1000)
//         if (player.i) {
//             player.playVideo()
//             player.setVolume(volume)
//         }
//     }

//     const playerOnPause = () => {
//         if (!Object.keys(player).length) return
//         clearInterval(intervalId.current)
//         player.pauseVideo()
//     }

//     const onNextSong = () => {
//         let idxRem = currStation.songs.findIndex(song => (song.videoId === currSong.videoId))
//         clearInterval(intervalId.current)
//         if (reapetInd === 'repeat-one') {
//             player.seekTo(0)
//             setSongDuration(0)
//         }
//         else if (reapetInd === 'repeat-all') {
//             if (idxRem + 1 === currStation.songs.length) {
//                 idxRem = 0
//                 dispatch(setCurrSong(currStation.songs[idxRem]))
//             }
//             else dispatch(setCurrSong(currStation.songs[idxRem + 1]))
//             player.seekTo(0)
//             setSongDuration(0)
//         }
//         else if (idxRem + 1 < currStation.songs.length) {
//             dispatch(setCurrSong(currStation.songs[idxRem + 1]))
//         }
//         else return
//     }

//     return (
//         <main className="music-controller-container">
//             <section className="music-controller-main flex-center">
//                 <div className="music-controller-img">
//                     <img src={currSong.snippet.thumbnails.high.url} alt='' />
//                     <YouTube
//                                 videoId={currSong?.videoId}
//                                 opts={opts}
//                                 onReady={playerReady}
//                                 onPlay={playerOnPlay}
//                                 onPause={playerOnPause}
//                                 onEnd={onNextSong}
//                             />
//                 </div>
//                 <div className="music-controller-actions">
//                     <LikeButton />
//                     <div className="play-btn">
//                     </div>
//                 </div>
//             </section>
//             <div className='music-controller-time-slider'>
//                 <SliderBar disabled={false} value={+songDuration} maxValue={songTotalDurationNum}/>
//             </div>

//         </main>
//     )
// }
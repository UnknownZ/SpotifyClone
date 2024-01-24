import React, { useEffect, useState, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaForward, FaBackward, FaPlay, FaPause } from 'react-icons/fa';
import { BsRepeat, BsShuffle } from "react-icons/bs";

const MusicList = () => {
  const [songs, setSongs] = useState(null);
  const [shuffled, setShuffled] = useState([]);
  const [currentList, setCurrentList] = useState([])
  const [index, setIndex] = useState(1);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [looping, setLooping] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const refSong = useRef(0);
  const progressBar = useRef(0);


  useEffect(() => {
    getSongs('https://playground.4geeks.com/apis/fake/sound/songs');
  }, [])

  const shuffleArr = (arr2) => {
    for (let i = arr2.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
    }
    return arr2;
  };

  const getSongs = (url) => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        if (response.status === 404) throw new Error("Page not found");

        return response.json();
      })
      .then((data) => {
        setSongs(data);
        setShuffled(shuffleArr([...data]));
        setCurrentList(data);
      })

      .catch((error) => {
        console.log('An error ocurred: ', error);
      });
  }

  const selectSong = id => {
    pauseSong();
    setIndex(id);
    const songURL = "https://playground.4geeks.com/apis/fake/sound/" + currentList[id - 1].url;
    refSong.current.src = songURL;
    refSong.current.volume = volume;
    playSong();
  };

  const playSong = () => {
    refSong.current.play();
    setPlaying(true);
  }

  const pauseSong = () => {
    refSong.current.pause();
    setPlaying(false);
  }

  const playPause = () => {
    if (refSong.current.paused) {
      playSong()
    }
    else {
      pauseSong()
    }
  }

  const toggleShuffle = () => {
    if (shuffle) {
      setCurrentList(songs)
      setShuffle(!shuffle);
    }
    else {
      setCurrentList(shuffled)
      setShuffle(!shuffle);
    }
  }

  const findSong = () =>{

  }

  const toggleLoop = () => {
    if (looping) {
      refSong.current.loop = true;
      setLooping(!looping);
    }
    else {
      refSong.current.loop = false;
      setLooping(!looping);
    }
  }

  const previousSong = () => {
    pauseSong()
    let next; 
    next = index - 1
    if (next < 1 ) {
      next = currentList.length
      selectSong(next)
      setIndex(next)
    }
    else {
      selectSong(next)
      setIndex(next)
    }
    playSong()
  }

  const nextSong = () => {
    pauseSong()
    let next;
    next = index + 1
    if (next > currentList.length) {
      next = 1
      selectSong(next) 
      setIndex(next)
    }
    else {
      selectSong(next) 
      setIndex(next) 
    }
    playSong()
  }

  function sToTime(t) {
    return padZero(parseInt((t / (60)) % 60)) + ":" +
      padZero(parseInt((t) % 60));
  }
  function padZero(v) {
    return (v < 10) ? "0" + v : v;
  }

  const volumeControlUp = () => {
    if ((refSong.current.volume).toFixed(1) != 1) {
      refSong.current.volume += 0.1;
      setVolume(refSong.current.volume)
    }
  }

  const volumeControlDown = () => {
    if ((refSong.current.volume).toFixed(1) != 0) {
      refSong.current.volume -= 0.1;
      setVolume(refSong.current.volume)
    }
  }

  const progressControl = () => {
    refSong.current.currentTime = progressBar.current.value;
    setProgress(progressBar.current.value);
  }

  const setManualProgress = () => {
    refSong.current.progress = progressBar.current.value
  }

  const handleProgress = () => {
    const duration = refSong.current.duration;
    const current = refSong.current.currentTime;
    const songProgress = (current / duration) * 100;
    setProgress(songProgress);
  }


  return (
    <div className="List">
      <ul className='list-group'>
        {
          songs !== null &&
          songs.length > 0 &&
          songs.map((song, i) => {
            return (
              <li
                key={i}
                className='list-group-item'
              >
                {song.name}
                <input
                  type="button"
                  value="Play"
                  onClick={() => {
                    selectSong(song.id)
                    setIndex(song.id)
                  }
                  }
                />
              </li>
            )
          })
        }
      </ul>

      <div id="Player">
        <div className='Song'>
          <audio
            ref={refSong}
            onTimeUpdate={handleProgress}
          >
          </audio>
        </div>
        <div
          className='Controls d-flex'
        >
          <span
            className='Current'>
            {
              sToTime(refSong.current.currentTime)
            }
          </span>
          <input
            type="range"
            value={progress}
            ref={progressBar}
            onClick={setManualProgress}
            onChange={progressControl}
            max="100"
          />
          <span
            className='Duration'>
            {
              refSong.current.duration ? sToTime(refSong.current.duration) : "00:00:00"
            }
          </span>
          <div >
            <input
              id="volumeDown"
              value="-"
              onClick={volumeControlDown}
              type="button"
            />
            <input
              id="volumeUp"
              value="+"
              onClick={volumeControlUp}
              type="button"
            />
          </div>

          <div>
            <button
              className="btn btn-info"
              onClick={previousSong}
              id='PreviousSong'
            >
              <FaBackward />
            </button>
            <button
              className="btn btn-info"
              onClick={() => playPause()}
            >
              {
                playing ? <FaPause /> : <FaPlay />
              }
            </button>
            <button
              className="btn btn-info"
              onClick={toggleShuffle}
            >{
                shuffle ? <BsShuffle className='text-danger' /> : <BsShuffle />
              }
            </button>
            <button
              className='btn btn-info'
              onClick={toggleLoop}
            >
              {
                looping ? <BsRepeat className='text-danger' /> : <BsRepeat />
              }
            </button>
            <button
              onClick={nextSong}
              className="btn btn-info"
              id='NextSong'
            >
              <FaForward />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default MusicList
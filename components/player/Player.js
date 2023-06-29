import React, { useEffect, useState, useMemo } from 'react';
// import custom hooks
import useSpotify from '@/hooks/useSpotify';
import { debounce } from 'lodash';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
import { activeListInUseState } from '@/atoms/showAtom';
// import component
import PlayingInfo from './PlayingInfo';
// please vist https://heroicons.com/ for icon details
import {
  ArrowsRightLeftIcon,
  BackwardIcon,
  ForwardIcon,
  ArrowPathRoundedSquareIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/solid';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';

/**
 * Renders the track player at the bottom of screen
 * @function Player
 * @returns {JSX}
 */
function Player() {
  const spotifyApi = useSpotify();

  const [shuffleState, setShuffletState] = useState(false);
  const [repeatState, setRepeatState] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );
  // list to reference when finding episode ID
  const activeListInUse = useRecoilValue(activeListInUseState);

  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);

  const debounceAdjustVolume = useMemo(
    () =>
      debounce((volume) => {
        if (spotifyApi.getAccessToken()) {
          spotifyApi
            .getMyDevices()
            .then((data) => {
              const activeDevice = data.body.devices.find(
                (device) => device.is_active
              );
              console.log(activeDevice ? 'Device Found' : 'NO Device Found - Connect to Spotify');
              if (activeDevice) {
                spotifyApi.setVolume(volume).catch((err) => {
                  console.error(err);
                });
              }
            })
            .catch((err) => {
              console.error('Something went wrong!', err);
            });
        }
      }, 500),
    [spotifyApi]
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [debounceAdjustVolume, volume]);

  useEffect(() => {
    setTimeout(() => {
      if (spotifyApi.getAccessToken()) {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          if (data.body?.is_playing) {
            setIsPlaying(true);
          }
        });
      }
    }, '500');
  }, [setIsPlaying, spotifyApi]);

  /* set shuffle of tracks on or off */
  const setShuffle = () => {
    setShuffletState((prevState) => !prevState);
    spotifyApi
      .setShuffle(!shuffleState)
      .catch((err) => console.error('Shuffle failed:'));
  };

  /**
   * ID not returned by getMyCurrentPlayingTrack for an episode so find the episode ID manually
   * @function findPreviousEpisodeId
   * @returns the Id for the previous episode
   */
  const findPreviousEpisodeId = () => {
    const episodeIndex = activeListInUse.findIndex(
      (episode) => episode.id === currentTrackId
    );
    const previousEpisodeId =
      episodeIndex > 0 ? activeListInUse[episodeIndex - 1]?.id : null;
    return previousEpisodeId || currentTrackId;
  };

  /* go back a track if playing */
  const skipToPrevious = () => {
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((data) => {
        if (data.body?.is_playing) {
          spotifyApi
            .skipToPrevious()
            .then(() => {
              setTimeout(() => {
                spotifyApi
                  .getMyCurrentPlayingTrack()
                  .then((data) => {
                    if (data.body?.currently_playing_type === 'episode') {
                      setCurrentTrackId(findPreviousEpisodeId);
                    } else {
                      setCurrentTrackId(data.body?.item?.id);
                    }
                    if (currentSongIndex > 0) {
                      setCurrentSongIndex(currentSongIndex - 1);
                    } else {
                      setCurrentSongIndex(0);
                    }
                  })
                  .catch((err) =>
                    console.error('Get Current Track ID failed: ')
                  );
              }, 750);
            })
            .catch((err) => console.error('Skip to Next failed: '));
        }
      })
      .catch((err) => console.error('Get Current Playing Track failed: '));
  };

  /**
   * ID not returned by getMyCurrentPlayingTrack for an episode so find the episode ID manually
   * @function findEpisodeId
   * @returns the Id for the current episode
   */
  const findEpisodeId = () => {
    const episodeIndex = activeListInUse.findIndex(
      (episode) => episode.id === currentTrackId
    );
    return episodeIndex !== -1 ? currentTrackId : null;
  };

  /* either play or pause a track */
  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      const dataType = data.body?.currently_playing_type;
      if (data.body?.is_playing) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
          })
          .catch((err) => console.error('Pause failed: ', err));
      } else {
        spotifyApi
          .play()
          .then(() => {
            if (dataType === 'episode') {
              setCurrentTrackId(findEpisodeId);
            } else {
              setCurrentTrackId(data.body?.item?.id);
            }
            setIsPlaying(true);
            // if (data.body?.context !== null) {   // set ID if current track is part of a playlist
            //   setActivePlaylist(playlistId);
            // }
          })
          .catch((err) => console.error('Playback failed: ', err));
      }
    });
  };

  /**
   * ID not returned by getMyCurrentPlayingTrack for an episode so find the episode ID manually
   * @function findNextEpisodeId
   * @returns the Id for the next episode
   */
  const findNextEpisodeId = () => {
    const episodeIndex = activeListInUse.findIndex(
      (episode) => episode.id === currentTrackId
    );
    const nextEpisodeId =
      episodeIndex < activeListInUse?.length - 1
        ? activeListInUse[episodeIndex + 1]?.id
        : null;
    return nextEpisodeId || currentTrackId;
  };

  /* go forward a track if playing */
  const skipToNext = () => {
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((data) => {
        if (data.body?.is_playing) {
          spotifyApi
            .skipToNext()
            .then(() => {
              setTimeout(() => {
                spotifyApi
                  .getMyCurrentPlayingTrack()
                  .then((data) => {
                    if (data.body?.currently_playing_type === 'episode') {
                      setCurrentTrackId(findNextEpisodeId);
                    } else {
                      setCurrentTrackId(data.body?.item?.id);
                    }
                    setCurrentSongIndex(currentSongIndex + 1);
                  })
                  .catch((err) =>
                    console.error('Get Current Track ID failed: ')
                  );
              }, 750);
            })
            .catch((err) => console.error('Skip to Next failed: '));
        }
      })
      .catch((err) => console.error('Get Current Playing Track failed: '));
  };

  // handles 3 way toggle, off, repeat, repeat  once
  const handleRepeatToggle = () => {
    let adjusted = repeatState == 0 ? 1 : repeatState == 2 ? 0 : 2;
    let value = adjusted === 0 ? 'off' : adjusted === 1 ? 'context' : 'track';
    setRepeatState((prevState) => (prevState + 1) % 3);
    spotifyApi
      .setRepeat(`${value}`, {})
      .catch((err) => console.error('Repeat failed:'));
  };

  return (
    <div className="h-20 xs:h-24 bg-gradient-to-b from-black to-gray-900 text-white text-sm md:text-base px-2 md:px-8 grid grid-cols-3">
      <PlayingInfo /> {/* left hand side - album photo/info */}
      {/* player controls */}
      <div className="flex items-center justify-evenly">
        <button
          className="hidden sm:inline relative"
          onClick={() => setShuffle()}
        >
          <ArrowsRightLeftIcon
            className={`button ${
              shuffleState === false ? 'text-white' : 'text-green-500'
            }`}
          />
          {shuffleState && (
            <span className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
          )}
        </button>

        <button onClick={() => skipToPrevious()}>
          <BackwardIcon className="button" />
        </button>

        {isPlaying ? (
          <button onClick={handlePlayPause}>
            <PauseCircleIcon className="button w-10 h-10" />
          </button>
        ) : (
          <button onClick={handlePlayPause}>
            <PlayCircleIcon className="button w-10 h-10" />
          </button>
        )}

        <button onClick={() => skipToNext()}>
          <ForwardIcon className="button" />
        </button>

        <button
          className="hidden sm:inline relative"
          onClick={() => handleRepeatToggle()}
        >
          <ArrowPathRoundedSquareIcon
            className={`button w-6 h-6 ${
              repeatState === 0 ? 'text-white' : 'text-green-500'
            }`}
          />
          {repeatState === 1 || repeatState === 2 ? (
            <span className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
          ) : (
            ''
          )}

          {repeatState === 2 ? (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-green-500 pointer-events-none pr-[1.1px]">
              1
            </span>
          ) : (
            ''
          )}
        </button>
      </div>
      {/* volume control */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <SpeakerXMarkIcon
          className="button"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <SpeakerWaveIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;

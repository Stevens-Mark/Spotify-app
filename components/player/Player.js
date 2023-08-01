import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
// import custom hooks
import useSpotify from '@/hooks/useSpotify';
import { debounce } from 'lodash';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentItemIdState,
  originIdState,
  progressDataState,
} from '@/atoms/otherAtoms';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activeArtistState } from '@/atoms/artistAtom';
import { activeListInUseState, episodeDurationState } from '@/atoms/showAtom';
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
import ProgressAndSeek from './ProgressAndSeek';

/**
 * Renders the track player at the bottom of screen
 * @function Player
 * @returns {JSX}
 */
function Player() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const { data: session } = useSession();

  const [shuffleState, setShuffletState] = useState(false); // shuffle functionality
  const [repeatState, setRepeatState] = useState('off'); // repeat functionality
  const [volume, setVolume] = useState(50); // volume functionality

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );
  // playlist list to reference when finding episode or show ID
  const activeListInUse = useRecoilValue(activeListInUseState);
  const [episodeDuration, setEpisodeDuration] =
    useRecoilState(episodeDurationState);

  const setCurrentItemId = useSetRecoilState(currentItemIdState);
  const [originId, setOriginId] = useRecoilState(originIdState);
  const [isEpisode, setIsEpisode] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const activeArtist = useRecoilValue(activeArtistState);
  const [progressData, setProgressData] = useRecoilState(progressDataState);

  useEffect(() => {
    // take ID from url each time page changes
    setOriginId((router?.asPath).split('/').pop());
  }, [router?.asPath, setOriginId]);

  useEffect(() => {
    const isEpisode =
      router?.asPath &&
      /(episode|show|podcastAndEpisodes)/i.test(router.asPath); // check if episode/show pages to remove repeat & shuffle controls
    setIsEpisode(isEpisode);
    const isArtist = (router?.asPath).includes('artist'); // check if single artist page (to disable setting CurrentItemId
    setIsArtist(isArtist); // to album.id in skip forward/previous controls)
  }, [router?.asPath]);

  /* onload set state for playing, */
  /* shuffle & repeat (taken from spotify*/
  useEffect(() => {
    setTimeout(() => {
      if (spotifyApi.getAccessToken()) {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setShuffletState(data.body?.shuffle_state);
          setRepeatState(data.body?.repeat_state);
          setIsPlaying(data.body?.is_playing);
        });
      }
    }, 500);
  }, [setIsPlaying, spotifyApi, session]);

  /* set volume depending on user choose */
  /* debounce to avoid excessive calls */
  const debounceAdjustVolume = useMemo(
    () =>
      debounce((volume) => {
        if (spotifyApi.getAccessToken()) {
          spotifyApi
            .getMyDevices()
            .then((data) => {
              const activeDevice = data.body?.devices.find(
                (device) => device.is_active
              );
              console.log(
                activeDevice
                  ? 'Device Found'
                  : 'NO Device Found - Connect to Spotify'
              );
              if (activeDevice) {
                spotifyApi.setVolume(volume).catch((err) => {
                  console.error('Something went wrong !');
                  toast.error('Something went wrong !', {
                    theme: 'colored',
                  });
                });
              }
            })
            .catch((err) => {
              console.error('Something went wrong !');
              toast.error('Something went wrong !', {
                theme: 'colored',
              });
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

  /* set shuffle of tracks on or off */
  const setShuffle = () => {
    setShuffletState((prevState) => !prevState);
    spotifyApi.setShuffle(!shuffleState).catch((err) => {
      console.error('Shuffle failed: ');
      toast.error('Shuffle failed !', {
        theme: 'colored',
      });
    });
  };

  /**
   * ID not returned by getMyCurrentPlayingTrack for an episode so find the episode ID manually
   * @function findPreviousEpisodeId
   * @returns the Id for the previous episode & the duration of the episode
   */
  const findPreviousEpisodeId = useCallback(() => {
    const episodeIndex = activeListInUse.findIndex(
      (episode) => episode.id === currentTrackId
    );

    const previousEpisodeId =
      episodeIndex > 0 ? activeListInUse[episodeIndex - 1]?.id : null;

    const previousDuration =
      episodeIndex > 0 ? activeListInUse[episodeIndex - 1]?.duration_ms : null;

    if (previousDuration !== null) {
      setEpisodeDuration(previousDuration);
    }

    return previousEpisodeId || currentTrackId;
  }, [activeListInUse, currentTrackId, setEpisodeDuration]);

  /* go back a track if playing */
  const skipToPrevious = useCallback(() => {
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
                      setCurrentTrackId(findPreviousEpisodeId());
                      setCurrentItemId(findPreviousEpisodeId());
                    } else {
                      setCurrentTrackId(data.body?.item?.id);
                    }
                    // when navigating "songs" set album id on skip
                    if (
                      !activeArtist &&
                      !isArtist &&
                      originId === 'all' &&
                      data.body.context === null
                    ) {
                      setCurrentItemId(data.body?.item?.album?.id);
                    }
                    if (currentSongIndex > 0) {
                      setCurrentSongIndex(currentSongIndex - 1);
                    } else {
                      setCurrentSongIndex(0);
                    }
                  })
                  .catch((err) => {
                    console.error('Get Current Playing Track failed:');
                    toast.error('Skip to Previous failed !', {
                      theme: 'colored',
                    });
                  });
              }, 750);
            })
            .catch((err) => {
              console.error('Skip to Previous failed: ');
              toast.error('Skip to Previous failed !', {
                theme: 'colored',
              });
            });
        }
      })
      .catch((err) => {
        console.error('Get Current Playing Track failed:');
        toast.error('Skip to Previous failed !', {
          theme: 'colored',
        });
      });
  }, [
    spotifyApi,
    activeArtist,
    isArtist,
    originId,
    currentSongIndex,
    setCurrentTrackId,
    findPreviousEpisodeId,
    setCurrentItemId,
    setCurrentSongIndex,
  ]);

  /**
   * ID not returned by getMyCurrentPlayingTrack for an episode so find the episode ID manually
   * @function findEpisodeId
   * @returns the Id for the current episode & the duration of the episode
   */
  const findEpisodeId = useCallback(() => {
    const episodeIndex = activeListInUse.findIndex(
      (episode) => episode.id === currentTrackId
    );

    // Check if the episodeIndex is valid and not -1
    if (episodeIndex !== -1) {
      const currentDuration = activeListInUse[episodeIndex]?.duration_ms;
      setEpisodeDuration(currentDuration);
      return currentTrackId;
    }

    return null; // Return null if the episode is not found
  }, [activeListInUse, currentTrackId, setEpisodeDuration]);

  /* either play or pause a track */
  const handlePlayPause = () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        const dataType = data.body?.currently_playing_type;
        if (data.body?.is_playing) {
          spotifyApi
            .pause()
            .then(() => {
              setIsPlaying(false);
            })
            .catch((err) => {
              console.error('Pause failed: ');
              toast.error('Pause failed !', {
                theme: 'colored',
              });
            });
        } else {
          spotifyApi
            .play()
            .then(() => {
              if (dataType === 'episode') {
                setCurrentTrackId(findEpisodeId());
                setCurrentItemId(findEpisodeId());
              } else {
                setCurrentTrackId(data.body?.item?.id);
              }
              setIsPlaying(true);
              // if (data.body?.context !== null) {   // set ID if current track is part of a playlist
              //   setActivePlaylist(playlistId);
              // }
            })
            .catch((err) => {
              console.error('Playback failed: ');
              toast.error('Playback failed !', {
                theme: 'colored',
              });
            });
        }
      });
    }
  };

  /**
   * ID not returned by getMyCurrentPlayingTrack for an episode so find the episode ID manually
   * @function findNextEpisodeId
   * @returns the Id for the next episode & the duration of the episode
   */
  const findNextEpisodeId = useCallback(() => {
    const episodeIndex = activeListInUse.findIndex(
      (episode) => episode.id === currentTrackId
    );

    const nextEpisodeId =
      episodeIndex < activeListInUse.length - 1
        ? activeListInUse[episodeIndex + 1]?.id
        : null;

    const nextDuration =
      episodeIndex < activeListInUse.length - 1
        ? activeListInUse[episodeIndex + 1]?.duration_ms
        : null;

    if (nextDuration !== null) {
      setEpisodeDuration(nextDuration);
    }
    return nextEpisodeId || currentTrackId;
  }, [activeListInUse, currentTrackId, setEpisodeDuration]);

  /* go forward a track if playing */
  const skipToNext = useCallback(() => {
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
                      setCurrentTrackId(findNextEpisodeId());
                      setCurrentItemId(findNextEpisodeId());
                    } else {
                      setCurrentTrackId(data.body?.item?.id);
                    }
                    // when navigating "songs" set album id on skip
                    if (
                      !activeArtist &&
                      !isArtist &&
                      originId === 'all' &&
                      data.body.context === null
                    ) {
                      setCurrentItemId(data.body?.item?.album?.id);
                    }
                    setCurrentSongIndex(currentSongIndex + 1);
                  })
                  .catch((err) => {
                    console.error('Get Current Track ID failed: ');
                    toast.error('Something went wrong !', {
                      theme: 'colored',
                    });
                  });
              }, 750);
            })
            .catch((err) => {
              console.error('Skip to Next failed: ');
              toast.error('Skip to Next failed !', {
                theme: 'colored',
              });
            });
        }
      })
      .catch((err) => {
        console.error('Get Current Playing Track failed: ');
        toast.error('Something went wrong !', {
          theme: 'colored',
        });
      });
  }, [
    activeArtist,
    currentSongIndex,
    findNextEpisodeId,
    isArtist,
    originId,
    setCurrentItemId,
    setCurrentSongIndex,
    setCurrentTrackId,
    spotifyApi,
  ]);

  // handles 3 way toggle, off, repeat, repeat  once
  const handleRepeatToggle = () => {
    // Adjust the repeat state: 'off' -> 'track' -> 'context' -> 'off'
    let adjusted =
      repeatState === 'off'
        ? 'track'
        : repeatState === 'track'
        ? 'context'
        : 'off';

    setRepeatState(adjusted); // Update the state with the new repeat state

    // Apply the new repeat state to the Spotify player
    spotifyApi.setRepeat(adjusted).catch((err) => {
      console.error('Repeat failed: ', err);
      toast.error('Repeat failed!', {
        theme: 'colored',
      });
    });
  };

  useEffect(() => {
    if (!isPlaying) {
      // If not playing, clear the interval to stop fetching data
      return;
    }
    if (spotifyApi.getAccessToken()) {
      const fetchCurrentSong = () => {
        // Fetch the currently playing track periodically
        spotifyApi
          .getMyCurrentPlaybackState()
          .then((data) => {
            console.log('data', data);
            if (data.body?.is_playing) {
              if (data.body?.item) {
                // set track id to ensure shuffle highlights properly
                // const durationMs = data.body?.item?.duration_ms;
                // if (durationMs && durationMs > 0 && durationMs < 2500) {
                  // setCurrentTrackId(data.body?.item?.id);
                  // setCurrentItemId(data.body?.context?.uri.split(':').pop());
                // }
                // if track: set duration & current progress
                setProgressData({
                  duration: data.body?.item?.duration_ms,
                  progress: data.body?.progress_ms,
                });
              } else {
                setProgressData({
                  // otherwise episode set duration & current progress
                  duration: episodeDuration, // duration collected elsewhere as not returned in data
                  progress: data.body?.progress_ms,
                });
              }

              // Check if the current track finished: skip to next
              if (
                (data.body?.item &&
                  data.body?.progress_ms >=
                    data.body?.item?.duration_ms - 1500) ||
                (data.body?.currently_playing_type === 'episode' &&
                  data.body?.progress_ms >= episodeDuration - 1500)
              ) {
                skipToNext(); // Move to the next track automatically
                setProgressData({
                  duration: 0,
                  progress: 0,
                });
              }
            } else {
              setProgressData({
                duration: 0,
                progress: 0,
              });
            }
          })
          .catch((err) =>
            console.error('Fetching progress data failed: ', err)
          );
      };

      const interval = setInterval(fetchCurrentSong, 1000); // Fetch track info every 1 seconds
      return () => clearInterval(interval);
    }
  }, [spotifyApi, session, isPlaying, episodeDuration, setProgressData, skipToNext, setCurrentTrackId, setCurrentItemId]);

  return (
    <div className="h-20 xs:h-24 bg-gradient-to-b from-black to-gray-900 text-white text-sm md:text-base px-2 md:px-8 grid grid-cols-3 border-t-[0.1px] border-gray-900">
      {/* left hand side - album photo/info */}
      <PlayingInfo />

      {/* player controls */}
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-evenly w-full">
          {/* hide shuffle if on episode/show pages  */}
          {!isEpisode && (
            <button
              className="hidden sm:inline relative"
              onClick={() => setShuffle()}
              aria-label="shuffle songs on/off"
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
          )}

          <button
            onClick={() => skipToPrevious()}
            aria-label="skip To Previous Track"
          >
            <BackwardIcon className="button" />
          </button>

          <button onClick={handlePlayPause} aria-label="Play/Pause a track">
            {isPlaying ? (
              <PauseCircleIcon className="button w-10 h-10" />
            ) : (
              <PlayCircleIcon className="button w-10 h-10" />
            )}
          </button>

          <button onClick={() => skipToNext()} aria-label="skip To Next Track">
            <ForwardIcon className="button" />
          </button>

          {/* hide repeat if on episode/show pages  */}
          {!isEpisode && (
            <button
              className="hidden sm:inline relative"
              onClick={() => handleRepeatToggle()}
              aria-label="repeat track toggle"
            >
              <ArrowPathRoundedSquareIcon
                className={`button w-6 h-6 ${
                  repeatState === 'off' ? 'text-white' : 'text-green-500'
                }`}
              />
              {repeatState === 'track' || repeatState === 'context' ? (
                <span className="absolute top-6 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
              ) : (
                ''
              )}

              {repeatState === 'track' ? (
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-green-500 pointer-events-none pr-[1.1px]">
                  1
                </span>
              ) : (
                ''
              )}
            </button>
          )}
        </div>
        {/* progress bar */}
        <ProgressAndSeek
          currentPosition={progressData?.progress}
          duration={progressData?.duration}
        />
      </div>
      {/* volume control */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <SpeakerXMarkIcon
          className="button"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        {/* Hidden Label for Volume Control */}
        <label htmlFor="volume-control" className="sr-only">
          Volume Control
        </label>
        <input
          id="volume-control"
          className="w-14 md:w-28 1.5"
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

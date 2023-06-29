import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { playerInfoTypeState } from '@/atoms/idAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
import {
  showEpisodesUrisState,
  showEpisodesListState,
  episodesListState,
  episodesUrisState,
  activeListInUseState,
} from '@/atoms/showAtom';
// import functions
import { msToTime, getMonthYear } from '@/lib/time';
// import icons
import noImage from '@/public/images/noImageAvailable.svg';
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';
// import components
import TrackProgressBar from '../graphics/TrackProgressBar';

/**
 * Render a card for an episode
 * @function EpisodeCard
 * @param {object} track (episode track info)
 * @param {number} order track index in the episode list
 * @param {string} whichList (optional) either (a "show"episode/uris otherwise defaults episodeList & uris)
 * @returns {JSX}
 */
function EpisodeCard({ track, order, whichList }) {
  const spotifyApi = useSpotify();

  // used to determine what type of info to load/display in plyer window
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);

  const showEpisodesList = useRecoilValue(showEpisodesListState);
  const showEpisodesUris = useRecoilValue(showEpisodesUrisState);
  const episodesList = useRecoilValue(episodesListState);
  const episodesUris = useRecoilValue(episodesUrisState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // to identify the track position for the green highlight of the active track
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );

  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const setActiveListInUse = useSetRecoilState(activeListInUseState);

  useEffect(() => {
    const listToUse = whichList === 'show' ? showEpisodesList : episodesList;
    setTimeout(() => {
      if (
        currentSongIndex == null &&
        currentTrackId !== null &&
        listToUse !== null
      ) {
        const indexPosition = listToUse?.findIndex(
          (x) => x.id == currentTrackId
        );
        setCurrentSongIndex(indexPosition);
      }
    }, '500');
  }, [
    currentSongIndex,
    currentTrackId,
    episodesList,
    setCurrentSongIndex,
    showEpisodesList,
    whichList,
  ]);

  /**
   * Either play or pause current episode track
   * @function HandleEpisodePlayPause
   * @param {event object} event
   * @param {number} currentTrackIndex (offset) in  episode list
   */
  const HandleEpisodePlayPause = (event, currentTrackIndex) => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing && track?.id == currentTrackId) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
          })
          .catch((err) => console.error('Pause failed: '));
      } else {
        const urisToUse =
          whichList === 'show' ? showEpisodesUris : episodesUris;
        spotifyApi
          .play({
            uris: urisToUse,
            offset: { position: currentTrackIndex },
          })
          .then(() => {
            console.log('Playback Success');
            setPlayerInfoType('episode');
            setIsPlaying(true);
            setCurrentTrackId(track?.id);
            setCurrentSongIndex(currentTrackIndex);
            setActiveListInUse(
              whichList === 'show' ? showEpisodesList : episodesList
            ); // set list to reference for player
            setActivePlaylist(null); //episode playing so user's playlist null
          })
          .catch((err) => console.error('Playback failed: ', err));
      }
    });
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus = track?.id === currentTrackId && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [track?.id, currentTrackId, isPlaying]);

  const handleClick = (event) => {
    event.preventDefault();
    // temperary to block action
    // Handle the click event logic here,
    // use the router to navigate to a different page, for example
    // import { useRouter } from 'next/router';
    // const router = useRouter();
    // router.push('/some-page');
  };

  return (
    <Link href="#" onClick={handleClick}>
      <div className="border-b-[0.25px] border-gray-800 max-w-2xl xl:max-w-6xl">
        <div className="grid grid-cols-[max-content_1fr_1fr] md:grid-cols-[max-content_max-content_1fr_1fr] grid-rows-[max-content_max-content_1fr] rounded-lg hover:bg-gray-800 transition delay-100 duration-300 ease-in-out  text-white p-2 md:p-3 xl:p-4">
          <Image
            className="col-span-1 row-start-1 row-end-1 md:row-end-4 aspect-square rounded-md shadow-image mr-5 w-16 md:w-32"
            src={track?.images?.[0]?.url || noImage}
            alt=""
            width={100}
            height={100}
            style={{ objectFit: 'cover' }}
          />
          <h2
            className={`col-span-3 row-start-1 capitalize line-clamp-2 self-center
           ${
             activeStatus && order == currentSongIndex
               ? 'text-green-500'
               : 'text-white'
           }`}
          >
            {track?.name.replace('/', ' & ')}
          </h2>

          <div className="col-span-4 md:col-span-3 row-start-2 text-pink-swan pt-2 pb-3">
            <span className="mb-2 line-clamp-2">{track?.description}</span>
          </div>
          <button
            className="col-start-1 md:col-start-2 col-span-1"
            onClick={(event) => {
              HandleEpisodePlayPause(event, order);
            }}
          >
            {activeStatus && order == currentSongIndex ? (
              <PauseCircleIcon className="w-10 h-10 transition delay-100 duration-300 ease-in-out hover:scale-110" />
            ) : (
              <PlayCircleIcon className="w-10 h-10 transition delay-100 duration-300 ease-in-out hover:scale-110" />
            )}
          </button>

          <div className="col-start-2 md:col-start-3 col-span-2 row-start-3 flex items-center text-pink-swan -ml-3  md:ml-3">
            <span className="line-clamp-1">
              {getMonthYear(track?.release_date)}&nbsp;•&nbsp;
            </span>
            <span className="line-clamp-1">
              {msToTime(
                track?.duration_ms - track?.resume_point?.resume_position_ms
              )}
              {track?.resume_point?.fully_played ? '' : ' left'}
            </span>

            <TrackProgressBar
              resumePosition={track?.resume_point?.resume_position_ms}
              duration={track?.duration_ms}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default EpisodeCard;

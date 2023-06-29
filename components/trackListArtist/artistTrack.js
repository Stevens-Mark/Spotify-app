import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { artistTrackListState, artistTrackUrisState } from '@/atoms/artistAtom';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
import { playerInfoTypeState } from '@/atoms/idAtom';
// import player play/pause function
import { HandleTrackPlayPause } from '@/lib/playbackUtils';
// import icon
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import Equaliser from '@/components/graphics/Equaliser';

/**
 * Renders each track in the artist
 * @function ArtistTrack
 * @param {object} track information
 * @param {number} order track index in the artist list
 * @returns {JSX}
 */
function ArtistTrack({ track, order }) {
  const spotifyApi = useSpotify();
  const song = track;

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const artistTracklist = useRecoilValue(artistTrackListState);
  const artistTrackUris = useRecoilValue(artistTrackUrisState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // to identify the track position for the green highlight of the active track
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (
        currentSongIndex == null &&
        currentTrackId !== null &&
        artistTracklist !== null
      ) {
        const indexPosition = artistTracklist?.tracks?.findIndex(
          (x) => x.id == currentTrackId
        );
        setCurrentSongIndex(indexPosition);
      }
    }, '500');
  }, [artistTracklist, currentSongIndex, currentTrackId, setCurrentSongIndex]);

  /**
   * Either play or pause current track
   * @function  HandleTrackPlayPauseClick
   * @param {event object} event
   * @param {number} currentTrackIndex (offset) in artist track list
   */
  const HandleTrackPlayPauseClick = (event, currentTrackIndex) => {
    event.preventDefault();
    event.stopPropagation();

    const artistOptions = {
      song,
      artistTrackUris, // determines it's artist to play in  play/pause function
      currentTrackIndex,
      currentTrackId,
      setIsPlaying,
      setPlayerInfoType,
      setCurrentTrackId,
      setCurrentSongIndex,
      setActivePlaylist,
      spotifyApi,
    };
    HandleTrackPlayPause(artistOptions);
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus = song.id === currentTrackId && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [song.id, currentTrackId, isPlaying]);

  return (
    <div
      className="grid grid-cols-2 text-pink-swan py-4 px-5 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer"
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <div className="flex items-center space-x-4">
        <button
          className="w-2 md:w-4"
          onClick={(event) => {
            HandleTrackPlayPauseClick(event, order);
          }}
        >
          {!isShown ? (
            activeStatus && order == currentSongIndex ? (
              <Equaliser />
            ) : (
              order + 1
            )
          ) : activeStatus && order == currentSongIndex ? (
            <PauseIcon className="h-4" />
          ) : (
            <PlayIcon className="h-4" />
          )}
        </button>
        <Image
          className="h-10 w-10"
          src={song?.album.images[0].url}
          alt=""
          width={100}
          height={100}
        />
        <div>
          <h3
            className={`w-36 sm:w-72 mdlg:w-36 lg:w-60 xl:w-80 pr-2 ${
              activeStatus && order == currentSongIndex
                ? 'text-green-500'
                : 'text-white'
            } truncate`}
          >
            {song.name}
          </h3>
          <span className="w-40">{song.artists[0].name}</span>
        </div>
      </div>
      <div className="flex items-end xs:items-center justify-end ml-auto md:ml-0">
        <span className="pl-5">
          {millisToMinutesAndSeconds(song.duration_ms)}
        </span>
      </div>
    </div>
  );
}

export default ArtistTrack;

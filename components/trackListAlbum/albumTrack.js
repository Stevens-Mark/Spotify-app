import useSpotify from '@/hooks/useSpotify';
import React, { useState, useEffect } from 'react';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { albumIdState, albumTrackListState } from '@/atoms/albumAtom';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { playerInfoTypeState } from '@/atoms/idAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
// import player play/pause function
import { HandleTrackPlayPause } from '@/lib/playbackUtils';
// import icon
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import Equaliser from '@/components/graphics/Equaliser';

/**
 * Renders each track in the album
 * @function AlbumTrack
 * @param {object} track information
 * @param {number} order track index in the album list
 * @returns {JSX}
 */
function AlbumTrack({ track, order }) {
  const spotifyApi = useSpotify();
  const song = track;

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const currentAlbumId = useRecoilValue(albumIdState);
  const albumTracklist = useRecoilValue(albumTrackListState);
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
        albumTracklist !== null
      ) {
        const indexPosition = albumTracklist?.tracks?.items?.findIndex(
          (x) => x.id == currentTrackId
        );
        setCurrentSongIndex(indexPosition);
      }
    }, '500');
  }, [albumTracklist, currentSongIndex, currentTrackId, setCurrentSongIndex]);

  /**
   * Either play or pause current track
   * @function  HandleTrackPlayPauseClick
   * @param {event object} event
   * @param {number} currentTrackIndex (offset) in album track list
   */
  const HandleTrackPlayPauseClick = (event, currentTrackIndex) => {
    event.preventDefault();
    event.stopPropagation();

    const albumOptions = {
      song,
      currentAlbumId, // determines it's album to play in play/pause function
      currentTrackIndex,
      currentTrackId,
      setIsPlaying,
      setPlayerInfoType,
      setCurrentTrackId,
      setCurrentSongIndex,
      setActivePlaylist,
      spotifyApi,
    };
    HandleTrackPlayPause(albumOptions);
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus = song?.id === currentTrackId && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [song?.id, currentTrackId, isPlaying]);

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

        <div>
          <h3
            className={`w-36 xs:w-48 sm:w-72 xl:w-auto pr-2 ${
              activeStatus && order == currentSongIndex
                ? 'text-green-500'
                : 'text-white'
            } truncate`}
          >
            {song?.name}
          </h3>
          <p className="w-40">{song?.artists?.[0].name}</p>
        </div>
      </div>
      <div className="flex items-end xs:items-center justify-end ml-auto md:ml-0">
        <p className="pl-5">{millisToMinutesAndSeconds(song?.duration_ms)}</p>
      </div>
    </div>
  );
}

export default AlbumTrack;

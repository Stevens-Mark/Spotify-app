import useSpotify from '@/hooks/useSpotify';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
import { getMonthDayYear } from '@/lib/time';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { playerInfoTypeState } from '@/atoms/idAtom';
import {
  myPlaylistIdState,
  myPlaylistState,
  playlistIdState,
  playlistTrackListState,
  activePlaylistState,
} from '@/atoms/playListAtom';
// import icon
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import Equaliser from '../graphics/Equaliser';

/**
 * Renders each track in a playlist
 * @function PlaylistTrack
 * @param {object} track information
 * @param {number} order track index in the playlist list
 * @param {string} whichList (optional) either user playlist or defaults to other person's playlist
 * @returns {JSX}
 */
function PlaylistTrack({ track, order, whichList }) {
  const spotifyApi = useSpotify();
  const song = track.track;

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const playlistId = useRecoilValue(playlistIdState);
  const playlist = useRecoilValue(playlistTrackListState);
  const myPlaylistId = useRecoilValue(myPlaylistIdState);
  const myPlaylist = useRecoilValue(myPlaylistState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const listToUse = whichList === 'myPlaylist' ? myPlaylist : playlist;
    setTimeout(() => {
      if (
        currentSongIndex == null &&
        currentTrackId !== null &&
        listToUse !== null
      ) {
        const indexPosition = listToUse?.tracks.items.findIndex(
          (x) => x.track.id == currentTrackId
        );
        setCurrentSongIndex(indexPosition);
      }
    }, '500');
  }, [
    currentSongIndex,
    currentTrackId,
    myPlaylist,
    playlist,
    setCurrentSongIndex,
    whichList,
  ]);

  /* either play or pause current track */
  const handlePlayPause = (event, currentTrackIndex) => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing && song.id == currentTrackId) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
          })
          .catch((err) => console.error('Pause failed: '));
      } else {
        const IdToUse = whichList === 'myPlaylist' ? myPlaylistId : playlistId;
        spotifyApi
          .play({
            context_uri: `spotify:playlist:${IdToUse}`,
            offset: { position: currentTrackIndex },
          })
          .then(() => {
            console.log('Playback Success');
            setPlayerInfoType('track');
            setIsPlaying(true);
            setCurrentTrackId(song.id);
            setCurrentSongIndex(currentTrackIndex);
            setActivePlaylist(IdToUse);
          })
          .catch((err) => console.error('Playback failed: ', err));
      }
    });
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
            handlePlayPause(event, order);
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
          src={song.album?.images[0].url}
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
      <div className="flex items-end md:items-center justify-end mdlg:justify-between ml-auto md:ml-0">
        <span className="w-40 hidden mdlg:inline pr-3">{song.album.name}</span>
        <span className="w-48 hidden mdlg:inline">
          {getMonthDayYear(track.added_at)}
        </span>
        <span className="pl-5">
          {millisToMinutesAndSeconds(song.duration_ms)}
        </span>
      </div>
    </div>
  );
}

export default PlaylistTrack;

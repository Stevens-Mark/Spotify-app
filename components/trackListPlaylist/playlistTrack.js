import useSpotify from '@/hooks/useSpotify';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import {
  playerInfoTypeState,
  currentItemIdState,
  triggeredBySongState,
} from '@/atoms/idAtom';
import {
  myPlaylistIdState,
  myPlaylistState,
  playlistIdState,
  playlistTrackListState,
  activePlaylistState,
} from '@/atoms/playListAtom';
// import player play/pause function
import { HandleTrackPlayPause } from '@/lib/playbackUtils';
// import component
import RenderTracks from '../trackRender/renderTracks';

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

  const router = useRouter();
  const originId = (router?.asPath).split('/').pop();

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const playlistId = useRecoilValue(playlistIdState);
  const playlist = useRecoilValue(playlistTrackListState);
  const myPlaylistId = useRecoilValue(myPlaylistIdState);
  const myPlaylist = useRecoilValue(myPlaylistState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);

  const [triggeredBySong, setTriggeredBySong] =
    useRecoilState(triggeredBySongState);
  const setCurrentItemId = useSetRecoilState(currentItemIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
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

  /**
   * Either play or pause current track
   * @function  HandleTrackPlayPauseClick
   * @param {event object} event
   * @param {number} currentTrackIndex (offset) in playlist track list
   */
  const HandleTrackPlayPauseClick = (event, currentTrackIndex) => {
    event.preventDefault();
    event.stopPropagation();
    const IdToUse = whichList === 'myPlaylist' ? myPlaylistId : playlistId;

    const playlistsOptions = {
      originId,
      song,
      IdToUse,
      setCurrentItemId,
      currentTrackIndex,
      currentTrackId,
      setCurrentTrackId,
      setCurrentSongIndex,
      setPlayerInfoType,
      setIsPlaying,
      setActivePlaylist,
      triggeredBySong,
      setTriggeredBySong,
      spotifyApi,
    };
    HandleTrackPlayPause(playlistsOptions);
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus = song?.id === currentTrackId && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [song?.id, currentTrackId, isPlaying]);

  return (
    <RenderTracks
      isShown={isShown}
      setIsShown={setIsShown}
      HandleTrackPlayPauseClick={HandleTrackPlayPauseClick}
      order={order}
      activeStatus={activeStatus}
      currentSongIndex={currentSongIndex}
      song={song}
      addedAt={track?.added_at}
    />
  );
}

export default PlaylistTrack;

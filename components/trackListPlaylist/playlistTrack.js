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
  originIdState,
} from '@/atoms/otherAtoms';
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
 * @returns {JSX}
 */
function PlaylistTrack({ track, order }) {
  const spotifyApi = useSpotify();
  const song = track.track;

  const router = useRouter();

  const playlistId = useRecoilValue(playlistIdState);
  const playlist = useRecoilValue(playlistTrackListState);

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setCurrentItemId = useSetRecoilState(currentItemIdState);
  const [originId, setOriginId] = useRecoilState(originIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setOriginId((router?.asPath).split('/').pop());
  }, [router?.asPath, setOriginId]);

  useEffect(() => {
    setTimeout(() => {
      if (
        currentSongIndex == null &&
        currentTrackId !== null &&
        playlist !== null
      ) {
        const indexPosition = playlist?.tracks.items.findIndex(
          (x) => x.track.id == currentTrackId
        );
        setCurrentSongIndex(indexPosition);
      }
    }, '500');
  }, [currentSongIndex, currentTrackId, playlist, setCurrentSongIndex]);

  /**
   * Either play or pause current track
   * @function  HandleTrackPlayPauseClick
   * @param {event object} event
   * @param {number} currentTrackIndex (offset) in playlist track list
   */
  const HandleTrackPlayPauseClick = (event, currentTrackIndex) => {
    event.preventDefault();
    event.stopPropagation();

    const playlistsOptions = {
      originId,
      song,
      playlistId,
      setCurrentItemId,
      currentTrackIndex,
      currentTrackId,
      setCurrentTrackId,
      setCurrentSongIndex,
      setPlayerInfoType,
      setIsPlaying,
      setActivePlaylist,
      spotifyApi,
    };
    HandleTrackPlayPause(playlistsOptions);
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus =
      song?.id === currentTrackId && order === currentSongIndex && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [song?.id, currentTrackId, isPlaying, order, currentSongIndex]);

  return (
    <RenderTracks
      isShown={isShown}
      setIsShown={setIsShown}
      HandleTrackPlayPauseClick={HandleTrackPlayPauseClick}
      order={order}
      activeStatus={activeStatus}
      song={song}
      addedAt={track?.added_at}
    />
  );
}

export default PlaylistTrack;

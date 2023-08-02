import useSpotify from '@/hooks/useSpotify';
import React, { useState, useEffect } from 'react';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activeArtistState } from '@/atoms/artistAtom';
import {
  playerInfoTypeState,
  currentItemIdState,
  originIdState,
} from '@/atoms/otherAtoms';
import {
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

  const playlistId = useRecoilValue(playlistIdState);
  const playlist = useRecoilValue(playlistTrackListState);

  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const originId = useRecoilValue(originIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const [isShown, setIsShown] = useState(false);
  const setActiveArtist = useSetRecoilState(activeArtistState);
  const [activeStatus, setActiveStatus] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (
        currentSongIndex == null &&   //disabled as seems to effect/help shuffle ??
        currentTrackId !== null &&
        playlist !== null
      ) {
        const indexPosition = playlist?.tracks.items.findIndex(
          (x) => x.track.id == currentTrackId
        );
        setCurrentSongIndex(indexPosition);
      }
    }, 500);
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
      fromArtist: false,
      setActiveArtist,
    };
    HandleTrackPlayPause(playlistsOptions);
  };

  // used to set play/pause icons
  useEffect(() => {
    const newActiveStatus =
      song?.id === currentTrackId 
      && order === currentSongIndex && 
      currentItemId === originId 
      && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [currentItemId, currentSongIndex, currentTrackId, isPlaying, order, originId, song?.id]);

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

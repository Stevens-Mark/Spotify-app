import useSpotify from '@/hooks/useSpotify';
import React, { useState, useEffect } from 'react';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { albumIdState } from '@/atoms/albumAtom';
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
import { activePlaylistState } from '@/atoms/playListAtom';
// import player play/pause function
import { HandleTrackPlayPause } from '@/lib/playbackUtils';
// import component
import RenderTracks from '../trackRender/renderTracks';

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

  const currentAlbumId = useRecoilValue(albumIdState);
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState); // used to determine what type of info to load
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const originId = useRecoilValue(originIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // to identify the track position for the green highlight of the active track
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const [isShown, setIsShown] = useState(false);
  const setActiveArtist = useSetRecoilState(activeArtistState);
  const [activeStatus, setActiveStatus] = useState(false); // used to set play/pause icons
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
      originId,
      song,
      currentAlbumId, // determines it's album to play in play/pause function
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
    HandleTrackPlayPause(albumOptions);
  };

  useEffect(() => {
    const newActiveStatus =
      song?.id === currentTrackId && currentItemId === originId && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [currentItemId, currentTrackId, isPlaying, originId, song?.id]);

  return (
    <RenderTracks
      isShown={isShown}
      setIsShown={setIsShown}
      HandleTrackPlayPauseClick={HandleTrackPlayPauseClick}
      order={order}
      activeStatus={activeStatus}
      song={song}
    />
  );
}

export default AlbumTrack;

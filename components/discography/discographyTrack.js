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
import { albumIdState } from '@/atoms/albumAtom';
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
 * Renders each track in the discography
 * @function DiscographyTrack
 * @param {object} track information
 * @param {number} order track index in the album list
 * @param {string} currentAlbumId album id
 * @returns {JSX}
 */
function DiscographyTrack({ track, order, currentAlbumId }) {
  const spotifyApi = useSpotify();
  const song = track;

  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState); // used to determine what type of info to load
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const originId = useRecoilValue(originIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const setCurrentAlbumId = useSetRecoilState(albumIdState);
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
      setCurrentAlbumId,
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

  // set track to active or not
  useEffect(() => {
    const newActiveStatus = song?.id === currentTrackId && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [currentTrackId, isPlaying, song?.id]);

  return (
    <RenderTracks
      isShown={isShown}
      setIsShown={setIsShown}
      HandleTrackPlayPauseClick={HandleTrackPlayPauseClick}
      order={order}
      activeStatus={activeStatus}
      song={song}
      albumId={currentAlbumId}
    />
  );
}

export default DiscographyTrack;

import useSpotify from '@/hooks/useSpotify';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { albumIdState, albumTrackListState } from '@/atoms/albumAtom';
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

  const router = useRouter();

  const currentAlbumId = useRecoilValue(albumIdState);
  const albumTracklist = useRecoilValue(albumTrackListState);
  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setCurrentItemId = useSetRecoilState(currentItemIdState);
  const [originId, setOriginId] = useRecoilState(originIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // to identify the track position for the green highlight of the active track
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );

  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const [isShown, setIsShown] = useState(false);
  const setActiveArtist = useSetRecoilState(activeArtistState);

  // useEffect(() => {
  //   setOriginId((router?.asPath).split('/').pop());
  // }, [router?.asPath, setOriginId]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (
  //       currentSongIndex == null &&
  //       currentTrackId !== null &&
  //       albumTracklist !== null
  //     ) {
  //       const indexPosition = albumTracklist?.tracks?.items?.findIndex(
  //         (x) => x.id == currentTrackId
  //       );
  //       setCurrentSongIndex(indexPosition);
  //     }
  //   }, 500);
  // }, [albumTracklist, currentSongIndex, currentTrackId, setCurrentSongIndex]);

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

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
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
    />
  );
}

export default AlbumTrack;

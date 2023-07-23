import React, { useState, useEffect } from 'react';
import useSpotify from '@/hooks/useSpotify';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { likedUrisState } from '@/atoms/songAtom';
import { albumIdState } from '@/atoms/albumAtom';
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
import { activePlaylistState } from '@/atoms/playListAtom';
// import player play/pause function
import { HandleTrackPlayPause } from '@/lib/playbackUtils';
// import component
import RenderTracks from '../trackRender/renderTracks';

/**
 * Renders each track in the liked song list
 * @function LikedTrack
 * @param {object} track information
 * @param {number} order track index in the liked song list
 * @returns {JSX}
 */
function LikedTrack({ track, order }) {
  const spotifyApi = useSpotify();
  const song = track.track;
  const router = useRouter();

  const likedTrackUris = useRecoilValue(likedUrisState);

  const setCurrentAlbumId = useSetRecoilState(albumIdState);
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

  // useEffect(() => {
  //   setOriginId((router?.asPath).split('/').pop());
  // }, [router?.asPath, setOriginId]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (
  //       currentSongIndex == null &&
  //       currentTrackId !== null &&
  //       likedTracklist !== null
  //     ) {
  //       const indexPosition = likedTracklist?.tracks?.findIndex(
  //         (x) => x.id == currentTrackId
  //       );
  //       setCurrentSongIndex(indexPosition);
  //     }
  //   }, 500);
  // }, [currentSongIndex, currentTrackId, likedTracklist, setCurrentSongIndex]);

  /**
   * Either play or pause current track
   * @function  HandleTrackPlayPauseClick
   * @param {event object} event
   * @param {number} currentTrackIndex (offset) in artist track list
   */
  const HandleTrackPlayPauseClick = (event, currentTrackIndex) => {
    event.preventDefault();
    event.stopPropagation();

    const mediaTrackUris = likedTrackUris; //set variable to likedTrackUris (for HandleTrackPlayPause logic)


    const likedOptions = {
      originId,
      song,
      mediaTrackUris, // determines it's likedsongs to play in  play/pause function
      setCurrentItemId,
      currentTrackIndex,
      currentTrackId,
      setCurrentTrackId,
      setCurrentSongIndex,
      setPlayerInfoType,
      setIsPlaying,
      setActivePlaylist,
      spotifyApi,
      setCurrentAlbumId,
    };
    HandleTrackPlayPause(likedOptions);
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus = song?.id === currentTrackId && isPlaying;
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
      collection={true}
    />
  );
}

export default LikedTrack;

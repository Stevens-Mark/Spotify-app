import React, { useState, useEffect } from 'react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { likedUrisState } from '@/atoms/songAtom';
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
import { playlistIdState, activePlaylistState } from '@/atoms/playListAtom';
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

  const likedTrackUris = useRecoilValue(likedUrisState);
  const playlistId = useRecoilValue(playlistIdState);

  const setCurrentAlbumId = useSetRecoilState(albumIdState);
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const originId = useRecoilValue(originIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // to identify the track position for the green highlight of the active track
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const [isShown, setIsShown] = useState(false);
  const setActiveArtist = useSetRecoilState(activeArtistState);
  const [activeStatus, setActiveStatus] = useState(false);

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
      playlistId,
      mediaTrackUris, //send array of uris to play in play/pause function
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
      fromArtist: false,
      setActiveArtist,
    };
    HandleTrackPlayPause(likedOptions);
  };

  // used to set play/pause icons
  useEffect(() => {
    const newActiveStatus = song?.id === currentTrackId && (currentItemId === originId || currentItemId === null) && isPlaying; // null check added in case user refreshes page
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
      addedAt={track?.added_at}
      collection={true}
    />
  );
}

export default LikedTrack;

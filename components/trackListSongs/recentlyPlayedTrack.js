import React, { useState, useEffect } from 'react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { albumIdState } from '@/atoms/albumAtom';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
  recentlyUrisState,
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
 * Renders each track from the song list
 * @function RecentPlayedTrack
 * @param {object} track information
 * @param {number} order track index in the song list
 * @returns {JSX}
 */
function RecentPlayedTrack({ track, order }) {
  const spotifyApi = useSpotify();
  const song = track;

  const recentlyUris = useRecoilValue(recentlyUrisState); // song uris (from search)
  const setCurrentAlbumId = useSetRecoilState(albumIdState);

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  // const setCurrentItemId = useSetRecoilState(currentItemIdState);
  const originId = useRecoilValue(originIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // to identify the track position for the green highlight of the active track
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const [isShown, setIsShown] = useState(false);
  const setActiveArtist = useSetRecoilState(activeArtistState);

  /**
   * Either play or pause current track
   * @function  HandleTrackPlayPauseClick
   * @param {event object} event
   * @param {number} currentTrackIndex (offset) in artist track list
   */
  const HandleTrackPlayPauseClick = (event, currentTrackIndex) => {
    event.preventDefault();
    event.stopPropagation();

    const mediaTrackUris = recentlyUris; //set variable to recentlyUris (for HandleTrackPlayPause logic)

    const songsOptions = {
      originId,
      song,
      mediaTrackUris, //send array of uris to play in play/pause function
      setCurrentItemId,
      currentTrackIndex,
      setCurrentTrackId,
      currentTrackId,
      setCurrentSongIndex,
      setPlayerInfoType,
      setIsPlaying,
      setActivePlaylist,
      spotifyApi,
      setCurrentAlbumId,
      fromArtist: false,
      setActiveArtist,
    };
    HandleTrackPlayPause(songsOptions);
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus = song?.id === currentTrackId && currentItemId === originId  && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [song?.id, currentTrackId, isPlaying, currentItemId, originId]);

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

export default RecentPlayedTrack;

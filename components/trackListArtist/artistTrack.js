import React, { useState, useEffect } from 'react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { artistTrackUrisState, activeArtistState } from '@/atoms/artistAtom';
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
 * Renders each track in the artist
 * @function ArtistTrack
 * @param {object} track information
 * @param {number} order track index in the artist list
 * @returns {JSX}
 */
function ArtistTrack({ track, order }) {
  const spotifyApi = useSpotify();
  const song = track;

  const artistTrackUris = useRecoilValue(artistTrackUrisState);

  const setCurrentAlbumId = useSetRecoilState(albumIdState);
  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setCurrentItemId = useSetRecoilState(currentItemIdState);
  const originId = useRecoilValue(originIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // to identify the track position for the green highlight of the active track
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
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

    const mediaTrackUris = artistTrackUris; //set variable to artistTrackUris (for HandleTrackPlayPause logic)

    const artistOptions = {
      originId,
      song,
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
      fromArtist: true,
      setActiveArtist,
    };
    HandleTrackPlayPause(artistOptions);
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

export default ArtistTrack;

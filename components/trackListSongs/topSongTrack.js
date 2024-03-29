import React, { useState, useEffect } from 'react';
import useSpotify from '@/hooks/useSpotify';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { albumIdState } from '@/atoms/albumAtom';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
  songsUrisState,
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
import TopSongCard from '../cards/topSongCard';

/**
 * Renders each track from the song list
 * @function TopSongTrack
 * @param {object} track information
 * @param {number} order track index
 * @returns {JSX}
 */
function TopSongTrack({ track, order }) {
  const spotifyApi = useSpotify();
  const song = track;
  const router = useRouter();

  const songsUris = useRecoilValue(songsUrisState); // song uris (from search)
  const setCurrentAlbumId = useSetRecoilState(albumIdState);

   const setPlayerInfoType = useSetRecoilState(playerInfoTypeState); // used to determine what type of info to load
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setCurrentItemId = useSetRecoilState(currentItemIdState);
  const [originId, setOriginId] = useRecoilState(originIdState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // to identify the track position for the green highlight of the active track
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const setActiveArtist = useSetRecoilState(activeArtistState);
  const [activeStatus, setActiveStatus] = useState(false);

  useEffect(() => {
    setOriginId((router?.asPath).split('/').pop());
  }, [router?.asPath, setOriginId]);

  /**
   * Either play or pause current track
   * @function  HandleTrackPlayPauseClick
   * @param {event object} event
   * @param {number} currentTrackIndex (offset) in artist track list
   */
  const HandleTrackPlayPauseClick = (event, currentTrackIndex) => {
    event.preventDefault();
    event.stopPropagation();

    const mediaTrackUris = songsUris; //set variable to songsUris (for HandleTrackPlayPause logic)

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
  useEffect(() => {
    const newActiveStatus = song?.id === currentTrackId && isPlaying;
    setActiveStatus(newActiveStatus);
  }, [song?.id, currentTrackId, isPlaying]);

  return (
    <TopSongCard
      HandleTrackPlayPauseClick={HandleTrackPlayPauseClick}
      order={order}
      activeStatus={activeStatus}
      song={song}
    />
  );
}

export default TopSongTrack;

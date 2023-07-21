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
  songsListState,
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

  const songsList = useRecoilValue(songsListState);
  const songsUris = useRecoilValue(songsUrisState); // song uris (from search)

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

  useEffect(() => {
    setOriginId((router?.asPath).split('/').pop());
  }, [router?.asPath, setOriginId]);

  useEffect(() => {
    setTimeout(() => {
      if (
        currentSongIndex == null &&
        currentTrackId !== null &&
        songsList !== null
      ) {
        const indexPosition = songsList?.tracks?.items?.findIndex(
          (x) => x.id == currentTrackId
        );
        setCurrentSongIndex(indexPosition);
      }
    }, 500);
  }, [currentSongIndex, currentTrackId, setCurrentSongIndex, songsList]);

  /**
   * Either play or pause current track
   * @function  HandleTrackPlayPauseClick
   * @param {event object} event
   * @param {number} currentTrackIndex (offset) in artist track list
   */
  const HandleTrackPlayPauseClick = (event, currentTrackIndex) => {
    event.preventDefault();
    event.stopPropagation();

    const artistTrackUris = songsUris; //set variable to songsUris (for HandleTrackPlayPause logic)

    const songsOptions = {
      originId,
      song,
      artistTrackUris, // determines it's artist/songs to play in  play/pause function
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
    };
    HandleTrackPlayPause(songsOptions);
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
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

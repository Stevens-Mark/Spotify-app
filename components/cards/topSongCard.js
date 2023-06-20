import React, { useMemo } from 'react';
import useSpotify from '@/hooks/useSpotify';
import Image from 'next/image';
// import state management recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
import { currentItemIdState, currentAlbumIdState } from '@/atoms/idAtom';
import { playerInfoTypeState } from '@/atoms/idAtom';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
// import component/icons
import noImage from '@/public/images/noImageAvailable.svg';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

/**
 * Renders the 4 songs next to top result
 * @function TopSongCard
 * @param {number} order track index NOT IN USE CURRENTLY AS MAY NOT BE NEEDED
 * @param {object} song information
 * @returns {JSX}
 */
const TopSongCard = ({ order, song }) => {
  const spotifyApi = useSpotify();

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState); // to control player information window

  // const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);

  // used to set play/pause icons
  const [currentAlbumId, setCurrentAlbumId] =
    useRecoilState(currentAlbumIdState);
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);

  /**
   * Either play or pause current track
   * @function handlePlayPause
   * @param {event object} event NO IN USE CURRENTLY
   */
  const handlePlayPause = (event) => {
    setCurrentItemId(song.id);
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (
        (currentItemId === song.id && data.body?.is_playing) ||
        (currentAlbumId === song.album.id &&
          currentTrackId === song.id &&
          isPlaying)
      ) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
            // setCurrentSongIndex(null);
            // setCurrentAlbumId(null);
          })
          .catch((err) => console.error('Pause failed: ', err));
      } else {
        spotifyApi
          .play({
            uris: [`spotify:track:${song.id}`],
          })
          .then(() => {
            console.log('Playback Success');
            setPlayerInfoType('tracks');
            setIsPlaying(true);
            setCurrentTrackId(song.id); // will trigger playerInfo to update
            setCurrentAlbumId(song.album.id);
            // setCurrentSongIndex(order);
            setActivePlaylist(null); // so removes speaker icon from playlist sidebar
          })
          .catch((err) => console.error('Playback failed: ', err));
      }
    });
  };

  // used to set play/pause icons
  const activeSongStatus = useMemo(() => {
    return (song.id === currentItemId && isPlaying) ||
      (currentAlbumId === song.album.id &&
        currentTrackId === song.id &&
        isPlaying)
      ? true
      : false;
  }, [
    song.id,
    song.album.id,
    currentItemId,
    isPlaying,
    currentAlbumId,
    currentTrackId,
  ]);

  return (
    <div
      className={`group flex justify-between text-pink-swan p-2 rounded-md hover:text-white hover:bg-gray-800 transition delay-100 duration-300 ease-in-out overflow-hidden ${
        activeSongStatus ? 'text-white bg-gray-800' : ''
      }`}
      onClick={(event) => {
        handlePlayPause(event);
      }}
    >
      <div className="flex relative">
        <Image
          className="h-10 w-10 mr-2 rounded-sm"
          src={song.album?.images?.[0]?.url || noImage}
          alt=""
          width={100}
          height={100}
        />
        <span
          className={`absolute inset-0 w-10 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            activeSongStatus ? 'opacity-100' : ''
          }`}
        />

        {activeSongStatus ? (
          <PauseIcon
            className={`absolute text-white top-2.5 left-3 h-5 ${
              activeSongStatus ? 'opacity-100' : ''
            }`}
          />
        ) : (
          <PlayIcon
            className={`absolute text-white top-2.5 left-3 h-5 group-hover:opacity-100 opacity-0 transition delay-100 duration-300 ${
              activeSongStatus ? 'opacity-100' : ''
            }`}
          />
        )}

        <div>
          <h3
            className={`w-36 xxs:w-60 md:w-80 pr-2 truncate ${
              activeSongStatus ? 'text-green-500' : 'text-white'
            }`}
          >
            {song.name}
          </h3>
          <p className="w-36 xxs:w-60 md:w-80 pr-2 truncate">
            {song.artists[0].name}
          </p>
        </div>
      </div>
      <span className="self-end xs:self-center">
        {millisToMinutesAndSeconds(song.duration_ms)}
      </span>
    </div>
  );
};

export default TopSongCard;

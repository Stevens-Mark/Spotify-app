import React, { useState, useMemo } from 'react';
import useSpotify from '@/hooks/useSpotify';
import Image from 'next/image';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import {
  playlistIdState,
  playlistState,
  activePlaylistState,
} from '@/atoms/playListAtom';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
// import component/icons
import noImage from '@/public/images/noImageAvailable.svg';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

const TopSongCard = ({ song }) => {
  const spotifyApi = useSpotify();
  const [currentrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);

  const handlePlayPause = (event, currentTrackIndex) => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing && song.id === currentrackId) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
          })
          .catch((err) => console.error('Pause failed: ', err));
      } else {
        spotifyApi
          .play({
            uris: [`spotify:track:${song.id}`],
          })
          .then(() => {
            console.log('Playback Success');
            setIsPlaying(true);
            setCurrentTrackId(song.id); // will trigger playerInfo to update
            // setCurrentSongIndex(currentTrackIndex);
            // setActivePlaylist(null);
          })
          .catch((err) => console.error('Playback failed: ', err));
      }
    });
  };

  const activeStatus = useMemo(() => {
    return song.id === currentrackId && isPlaying ? true : false;
  }, [currentrackId, isPlaying, song.id]);

  return (
    <div
      className={`group flex justify-between text-pink-swan p-2 rounded-md hover:text-white hover:bg-gray-800 transition delay-100 duration-300 ease-in-out overflow-hidden ${
        activeStatus ? 'text-white bg-gray-800' : ''
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
            activeStatus ? 'opacity-100' : ''
          }`}
        />

        {activeStatus ? (
          <PauseIcon
            className={`absolute text-white top-2.5 left-3 h-5 ${
              activeStatus ? 'opacity-100' : ''
            }`}
          />
        ) : (
          <PlayIcon
            className={`absolute text-white top-2.5 left-3 h-5 group-hover:opacity-100 opacity-0 transition delay-100 duration-300 ${
              activeStatus ? 'opacity-100' : ''
            }`}
          />
        )}

        <div>
          <h3
            className={`w-36 xxs:w-60 md:w-80 pr-2 truncate ${
              activeStatus ? 'text-green-500' : 'text-white'
            }`}
          >
            {song.album.name}
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

import useSpotify from '@/hooks/useSpotify';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
// import state management recoil
import { useRecoilState } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { playlistIdState, playlistState } from '@/atoms/playlistAtom';
// import icon
import { PlayIcon, PauseIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import Equaliser from './Equaliser';

function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const song = track.track;
  const [currentrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [isShown, setIsShown] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );

  console.log('playing state in Song: ', isPlaying);
  console.log('current track Id state in Song: ', currentrackId);

  const activeStatus = useMemo(() => {
    return song.id == currentrackId && isPlaying ? true : false;
  }, [currentrackId, isPlaying, song.id]);

  // function indexPosition(list, trackPlayingId) {
  //   const indexPosition = list?.tracks.items.findIndex(
  //     (x) => x.track.id === trackPlayingId
  //   );
  //   console.log('index: ', index);
  //   return indexPosition;
  // }

  const handlePlayPause = (event, currentTrackIndex) => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing && song.id == currentrackId) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi
          .play({
            context_uri: `spotify:playlist:${playlistId}`,
            offset: { position: currentTrackIndex },
          })
          .then(() => {
            console.log('Playback Success');
            setIsPlaying(true);
            setCurrentTrackId(song.id);
            setCurrentSongIndex(currentTrackIndex);
          })
          .catch((err) => console.error('Playback failed: ', err));
      }
    });
  };

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer"
      onClick={(event) => {
        handlePlayPause(event, order);
      }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <div className="flex items-center space-x-4">
        <p className="w-2 md:w-4">
          {!isShown ? (
            activeStatus && order == currentSongIndex ? (
              <Equaliser /> // <ChartBarIcon className="h-4 text-green-500" />
            ) : (
              order + 1
            )
          ) : activeStatus && order == currentSongIndex ? (
            <PauseIcon className="h-4" />
          ) : (
            <PlayIcon className="h-4" />
          )}
        </p>
        <Image
          className="h-10 w-10"
          src={song.album.images[0].url}
          alt="track"
          width={100}
          height={100}
        />
        <div>
          <p
            className={`w-36 lg:w-64 ${
              activeStatus && order == currentSongIndex
                ? 'text-green-500'
                : 'text-white'
            } truncate`}
          >
            {song.name}
          </p>
          <p className="w-40 ">{song.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{song.album.name}</p>
        <p>{millisToMinutesAndSeconds(song.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;

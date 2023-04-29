import useSpotify from '@/hooks/useSpotify';
import React, { useState } from 'react';
import Image from 'next/image';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
// import state management recoil
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';
import { playListIdState, playListState } from '@/atoms/playListAtom';
// import icon
import { PlayIcon } from '@heroicons/react/24/solid';

function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const song = track.track;
  const [currentrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [isShown, setIsShown] = useState(false);

  const [playlistId, setPlaylistId] = useRecoilState(playListIdState);

  const playSong = (event, currentTrackIndex) => {
    spotifyApi
      .play({
        context_uri: `spotify:playlist:${playlistId}`,
        offset: { position: currentTrackIndex },
      })
      .then(() => console.log('Playback Success'))
      .catch((err) => console.error('Playback failed: ', err));

    setCurrentTrackId(song.id);
    setIsPlaying(true);
  };

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer"
      onClick={(event) => {
        playSong(event, order);
      }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <div className="flex items-center space-x-4">
        <p className="w-2 md:w-4">
          {!isShown ? order + 1 : <PlayIcon className="h-4" />}
        </p>
        <Image
          className="h-10 w-10"
          src={song.album.images[0].url}
          alt="track"
          width={100}
          height={100}
        />
        <div>
          <p className="w-36 lg:w-64 text-white truncate">{song.name}</p>
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

import { useState, useEffect } from 'react';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState } from 'recoil';
import { playListIdState, playListState } from '@/atoms/playListAtom';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';

const PlaylistPlayer = () => {
  const [playlistId, setPlaylistId] = useRecoilState(playListIdState);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const spotifyApi = useSpotify();

  useEffect(() => {
    // Fetch the playlist and set the initial state
    spotifyApi
      .getPlaylist(playlistId)
      .then(({ body: { tracks } }) => {
        setPlaylist(tracks.items.map(({ track }) => track));
        setCurrentIndex(0);
      })
      .catch(console.error);
  }, [playlistId, spotifyApi]);

  // console.log('player2: ', playlist);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setCurrentIndex(
      currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(
      currentIndex === playlist.length - 1 ? 0 : currentIndex + 1
    );
  };

  useEffect(() => {
    // Play or pause the current track when the playing state changes
    if (isPlaying) {
      console.log(playlist[currentIndex].uri);
      spotifyApi
        .play({ uris: [playlist[currentIndex].uri] })
        .catch(console.error);
    } else {
      spotifyApi.pause().catch(console.error);
    }
  }, [isPlaying, currentIndex, spotifyApi, playlist]);

  useEffect(() => {
    // Skip to the previous or next track when the current index changes
    if (isPlaying) {
      spotifyApi.skipToNext().catch(console.error);
    }
  }, [currentIndex, isPlaying, spotifyApi]);

  return (
    <div className="text-white">
      <div>{playlist[currentIndex]?.name}</div>
      <button onClick={handlePrev}>Prev</button>
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default PlaylistPlayer;

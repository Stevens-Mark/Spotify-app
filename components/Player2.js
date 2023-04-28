import { useState, useEffect } from 'react';
import useSpotify from '@/hooks/useSpotify';
import Image from 'next/image';
// import state management recoil
import { useRecoilState } from 'recoil';
import { playListIdState, playListState } from '@/atoms/playListAtom';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';
import useSongInfo from '@/hooks/useSongInfo';

const PlaylistPlayer = () => {
  const [playlistId, setPlaylistId] = useRecoilState(playListIdState);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const spotifyApi = useSpotify();
  const songInfo = useSongInfo();
  const [volume, setVolume] = useState(50);
  const [currenTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

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

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      // fetch the song info
      const fetchCurrentSong = () => {
        if (!songInfo) {
          spotifyApi.getMyCurrentPlayingTrack().then((data) => {
            setCurrentTrackId(data.body?.item?.id);

            spotifyApi.getMyCurrentPlaybackState().then((data) => {
              setIsPlaying(data.body?.is_playing);
            });
          });
        }
      };
      fetchCurrentSong();
      setVolume(50);
    }
  }, [spotifyApi, setIsPlaying, songInfo, setCurrentTrackId]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white text-sm md:text-base px-2 md:px-8 grid grid-cols-3">
      {/* left hand side */}
      <div className="flex items-center space-x-4">
        <Image
          className="hidden md:inline h-10 w-10"
          src={playlist[currentIndex]?.album.images?.[0]?.url}
          alt="Track playing ..."
          width={100}
          height={100}
        />
        <div>
          <h3>{playlist[currentIndex]?.name}</h3>
          <p>{playlist[currentIndex]?.artists?.[0]?.name}</p>
        </div>
      </div>
      <div className="text-white">
        <div>{playlist[currentIndex]?.name}</div>
        <button onClick={handlePrev}>Prev</button>
        <button onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default PlaylistPlayer;

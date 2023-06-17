import useSpotify from '@/hooks/useSpotify';
import React, { useState, useMemo, useEffect } from 'react';
// import functions
import { millisToMinutesAndSeconds } from '@/lib/time';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { albumIdState, albumTrackListState } from '@/atoms/albumAtom';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
// import icon
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import Equaliser from '@/components/Equaliser';

/**
 * Renders each track in the album
 * @function AlbumTrack
 * @param {object} track information
 * @param {number} order track index in the album list
 * @returns {JSX}
 */
function AlbumTrack({ track, order }) {
  const spotifyApi = useSpotify();
  const song = track;

  const currentAlbumId = useRecoilValue(albumIdState);
  const albumTracklist = useRecoilValue(albumTrackListState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  // to identify the track position for the green highlight of the active track
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (
        currentSongIndex == null &&
        currentTrackId !== null &&
        albumTracklist !== null
      ) {
        const indexPosition = albumTracklist?.tracks?.items.findIndex(
          (x) => x.id == currentTrackId
        );
        setCurrentSongIndex(indexPosition);
      }
    }, '500');
  }, [albumTracklist, currentSongIndex, currentTrackId, setCurrentSongIndex]);

  /**
   * Either play or pause current album track
   * @function HandlePlayPause
   * @param {event object} event 
   * @param {number} currentTrackIndex (offset) in album track list
   */
  const handlePlayPause = (event, currentTrackIndex) => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing && song.id == currentTrackId) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
          })
          .catch((err) => console.error('Pause failed: '));
      } else {
        spotifyApi
          .play({
            context_uri: `spotify:album:${currentAlbumId}`,
            offset: { position: currentTrackIndex },
          })
          .then(() => {
            console.log('Playback Success');
            setIsPlaying(true);
            setCurrentTrackId(song.id);
            setCurrentSongIndex(currentTrackIndex);
            setActivePlaylist(null); //album playing so user's playlist null
          })
          .catch((err) => console.error('Playback failed: ', err));
      }
    });
  };

  // used to set play/pause icons
  const activeStatus = useMemo(() => {
    return song.id === currentTrackId && isPlaying ? true : false;
  }, [currentTrackId, isPlaying, song.id]);

  return (
    <div
      className="grid grid-cols-2 text-pink-swan py-4 px-5 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer"
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      <div className="flex items-center space-x-4">
        <button
          className="w-2 md:w-4"
          onClick={(event) => {
            handlePlayPause(event, order);
          }}
        >
          {!isShown ? (
            activeStatus && order == currentSongIndex ? (
              <Equaliser />
            ) : (
              order + 1
            )
          ) : activeStatus && order == currentSongIndex ? (
            <PauseIcon className="h-4" />
          ) : (
            <PlayIcon className="h-4" />
          )}
        </button>

        <div>
          <h3
            className={`w-36 xs:w-48 sm:w-72 xl:w-auto pr-2 ${
              activeStatus && order == currentSongIndex
                ? 'text-green-500'
                : 'text-white'
            } truncate`}
          >
            {song.name}
          </h3>
          <p className="w-40">{song.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-end xs:items-center justify-end ml-auto md:ml-0">
        <p className="pl-5">{millisToMinutesAndSeconds(song.duration_ms)}</p>
      </div>
    </div>
  );
}

export default AlbumTrack;

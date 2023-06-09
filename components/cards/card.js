import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
import { currentItemIdState, currentAlbumIdState } from '@/atoms/idAtom';
// import functions
import { millisecondsToMinutes, getMonthYear } from '@/lib/time';
import { capitalize } from '@/lib/capitalize';
// import icons/images
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';
import noImage from '@/public/images/noImageAvailable.svg';

/**
 * Render a card for either album, playlist, podcast, artist, or recentsearch
 * @function Card
 * @param {object} item (album, playlist, podcast, artist, or recentsearch info)
 * @param {string} type of card
 * @param {number} order track index in the list
 * @returns {JSX}
 */
function Card({ item, type, order }) {
  const spotifyApi = useSpotify();

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentAlbumId, setCurrentAlbumId] =
    useRecoilState(currentAlbumIdState);
  const [currentSongIndex, setCurrentSongIndex] = useRecoilState(
    currentSongIndexState
  );
  // used to set play/pause icons
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);

  // fetch playlist track
  const getPlaylistTrack = async (playlistId) => {
    try {
      const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 1 });
      const TrackId = data.body?.items[0]?.track.id;
      setCurrentTrackId(TrackId);
    } catch (err) {
      console.error('Error retrieving playlist track:');
    }
  };

  // fetch album track
  const getAlbumTrack = async (AlbumId) => {
    try {
      const data = await spotifyApi.getAlbumTracks(AlbumId, { limit: 1 });
      const TrackId = data.body?.items[0]?.id;
      setCurrentTrackId(TrackId);
      setCurrentAlbumId(AlbumId);
    } catch (err) {
      console.error('Error retrieving Album track:');
    }
  };

  /* either play or pause current track */
  const HandlePlayPause = (event, item, type, order) => {
    let address;
    let playPromise;
    setCurrentItemId(item.id);

    // set states when a track can play successfully
    const handlePlaybackSuccess = () => {
      console.log('Playback Success');
      setIsPlaying(true);
      setActivePlaylist(item.id);
      setCurrentSongIndex(order);
      // setActivePlaylist(null);
    };

    // check if current playing track matches the one chosen by the user
    // if "yes" pause if "no" play the new track selected
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (currentItemId === item.id && data.body?.is_playing) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
            setCurrentSongIndex(null);
            setCurrentAlbumId(null);
            // setActivePlaylist(null);
          })
          .catch((err) => console.error('Pause failed: ', err));
      } else {
        // if artist selected get tracks Uris & play in player
        if (type === 'artist') {
          if (spotifyApi.getAccessToken()) {
            playPromise = spotifyApi
              .getArtistTopTracks(item.id, ['US', 'FR'])
              .then((data) => {
                setCurrentTrackId(data.body?.tracks[0]?.id);
                return data.body.tracks.map((track) => track.uri);
              })
              .then((trackUris) => {
                return spotifyApi.play({ uris: trackUris });
              })
              .catch((err) => {
                console.error(
                  'Either tracks retrieval or playback failed:',
                  err
                );
              });
          }
          // else get corresponding context_uri depending on if album or playlist
        } else if (type === 'playlist') {
          address = `spotify:playlist:${item.id}`;
          getPlaylistTrack(item.id);
        } else if (type === 'album') {
          address = `spotify:album:${item.id}`;
          getAlbumTrack(item.id);
        }
        // context_uri exists then play it
        if (address && spotifyApi.getAccessToken()) {
          playPromise = spotifyApi.play({ context_uri: address });
        }
        // if possible to play a track then call function to set states otherwise fail
        if (playPromise) {
          playPromise
            .then(handlePlaybackSuccess)
            .catch((err) => console.error('Playback failed: ', err));
        }
      }
    });
  };

  // used to set play/pause icons
  const activeStatus = useMemo(() => {
    return (currentItemId === item.id && isPlaying) ||
      (currentAlbumId === item.id && isPlaying)
      ? true
      : false;
  }, [currentAlbumId, currentItemId, isPlaying, item.id]);

  return (
    <Link
      href=""
      className={`group relative rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out pb-8`}
    >
      <div className="relative p-2 sm:p-2 md:p-3 xl:p-4">
        <Image
          className={`aspect-square w-full shadow-image ${
            type === 'artist' ? 'rounded-full' : 'rounded-md'
          }`}
          src={item?.images?.[0]?.url || noImage}
          alt=""
          width={100}
          height={100}
        />
        {type !== 'podcast' && type !== 'episode' && (
          <button
            className={`absolute bottom-24 right-7 bg-black rounded-full shadow-3xl text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-110 ${
              activeStatus
                ? '-translate-y-2'
                : 'opacity-0 group-hover:-translate-y-2 group-hover:opacity-100'
            }`}
            onClick={(event) => {
              HandlePlayPause(event, item, type, order);
            }}
          >
            {activeStatus ? (
              <PauseCircleIcon className="w-12 h-12 -m-2" />
            ) : (
              <PlayCircleIcon className="w-12 h-12 -m-2" />
            )}
          </button>
        )}

        <h2 className="text-white capitalize mt-2 truncate">
          {item?.name.replace('/', ' & ')}
        </h2>

        <div className="flex flex-wrap text-pink-swan mt-2 h-10">
          {/* album */}
          {type === 'album' && (
            <>
              <span>{item?.release_date.slice(0, 4)}&nbsp;•&nbsp;</span>
              {item?.artists.slice(0, 2).map((item) => (
                <span className="truncate" key={item?.id}>
                  {item?.name}.&nbsp;
                </span>
              ))}
            </>
          )}

          {/* playlist*/}
          {type === 'playlist' && (
            <span className="truncate">
              By {capitalize(item?.owner.display_name)}
            </span>
          )}

          {/*artist*/}
          {type === 'artist' && (
            <span className="truncate">{capitalize(item?.type)}</span>
          )}

          {/* podcast */}
          {type === 'podcast' && (
            <span className="truncate">{capitalize(item?.publisher)}</span>
          )}
          {/* episode */}
          {type === 'episode' && (
            <>
              <span className="line-clamp-1">
                {getMonthYear(item?.release_date)}&nbsp;•&nbsp;
              </span>
              <span className="line-clamp-1">
                {millisecondsToMinutes(item?.duration_ms)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Card;

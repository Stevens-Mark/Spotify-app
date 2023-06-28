import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
import { activePlaylistState } from '@/atoms/playListAtom';
import { currentAlbumIdState } from '@/atoms/albumAtom';
import { currentItemIdState, playerInfoTypeState } from '@/atoms/idAtom';
// import functions
import { millisecondsToMinutes, getMonthYear } from '@/lib/time';
import { capitalize } from '@/lib/capitalize';
// import icons/images
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';
import noImage from '@/public/images/noImageAvailable.svg';

/**
 * Render a card for either album, playlist, show, artist, or recentsearch
 * @function Card
 * @param {object} item (album, playlist, show, artist, or recentsearch info)
 * @returns {JSX}
 */
function Card({ item }) {
  const spotifyApi = useSpotify();

  // used to determine what type of info to load
  const setPlayerInfoType = useSetRecoilState(playerInfoTypeState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState); // to control player information window
  // used to set play/pause icons
  const [currentItemId, setCurrentItemId] = useRecoilState(currentItemIdState);
  const [currentAlbumId, setCurrentAlbumId] =
    useRecoilState(currentAlbumIdState);

  const linkAddress =
    item.type === 'album'
      ? `/album/${item.id}`
      : item.type === 'playlist'
      ? `/playlist/${item.id}`
      : item.type === 'artist'
      ? `/artist/${item.id}`
      : item.type === 'show'
      ? `/show/${item.id}`
      : '';

  /**
   * fetch playlist track & set TrackId state
   *@function getPlaylistTrack
   * @param {string} playlistId
   */
  const getPlaylistTrack = async (playlistId) => {
    try {
      const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 1 });
      const TrackId = data.body?.items[0]?.track.id;
      setCurrentTrackId(TrackId);
    } catch (err) {
      console.error('Error retrieving playlist track:');
    }
  };

  /**
   * fetch album track & set states accordingly
   * @function getAlbumTrack
   * @param {string} AlbumId
   */
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

  /**
   * Either play or pause current track
   * @function HandlePlayPause
   * @param {event object} event
   */
  const HandlePlayPause = (event) => {
    event.preventDefault(); // to prevent the default link behavior
    event.stopPropagation(); // to stop the event from propagating to parent elements.
    let address, playPromise;
    setCurrentItemId(item.id);

    // set states when a track can play successfully
    const handlePlaybackSuccess = () => {
      console.log('Playback Success');
      setPlayerInfoType('track');
      setIsPlaying(true);
      setCurrentSongIndex(0);
      setActivePlaylist(item.id);
      // setActivePlaylist(null);
    };

    // check if current playing track matches the one chosen by the user
    // if "yes" pause if "no" play the new track selected
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (
        (item.type !== 'album' &&
          currentItemId === item.id &&
          data.body?.is_playing) ||
        (item.type === 'album' && currentAlbumId === item.id && isPlaying)
      ) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
          })
          .catch((err) => console.error('Pause failed: ', err));
      } else {
        // if artist selected get tracks Uris & play in player
        if (item?.type === 'artist') {
          setCurrentAlbumId(null);
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
                  'Either Artist retrieval or playback failed:',
                  err
                );
              });
          }
          // else get corresponding context_uri depending on if album or playlist
        } else if (item?.type === 'playlist') {
          address = `spotify:playlist:${item.id}`;
          setCurrentAlbumId(null);
          getPlaylistTrack(item.id);
        } else if (item?.type === 'album') {
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
            .catch((err) =>
              console.error('Either album or Playlist Playback failed: ', err)
            );
        }
      }
    });
  };

  // used to set play/pause icons
  const [activeStatus, setActiveStatus] = useState(false);
  useEffect(() => {
    const newActiveStatus =
      (currentItemId === item.id && isPlaying) ||
      (currentAlbumId === item.id && isPlaying);

    setActiveStatus(newActiveStatus);
  }, [currentAlbumId, currentItemId, isPlaying, item.id]);

  return (
    <Link
      href={linkAddress}
      className={`group relative rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out pb-8`}
    >
      <div className="relative p-2 sm:p-2 md:p-3 xl:p-4">
        <Image
          className={`aspect-square w-full shadow-image ${
            item?.type === 'artist' ? 'rounded-full' : 'rounded-md'
          }`}
          src={item?.images?.[0]?.url || noImage}
          alt=""
          width={100}
          height={100}
        />
        {item?.type !== 'show' && item?.type !== 'episode' && (
          <button
            className={`absolute bottom-24 right-7 bg-black rounded-full shadow-3xl text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-110 ${
              activeStatus
                ? '-translate-y-2'
                : 'opacity-0 group-hover:-translate-y-2 group-hover:opacity-100'
            }`}
            onClick={(event) => {
              HandlePlayPause(event);
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
          {item?.type === 'album' && (
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
          {item?.type === 'playlist' && (
            <span className="truncate">
              By {capitalize(item?.owner.display_name)}
            </span>
          )}

          {/*artist*/}
          {item?.type === 'artist' && (
            <span className="truncate">{capitalize(item?.type)}</span>
          )}

          {/* show */}
          {item?.type === 'show' && (
            <span className="truncate">{capitalize(item?.publisher)}</span>
          )}
          {/* episode */}
          {item?.type === 'episode' && (
            <>
              <span className="-1">
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

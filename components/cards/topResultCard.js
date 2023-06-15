import React, { useMemo } from 'react';
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
import { currentItemIdState, currentAlbumIdState } from '@/atoms/idAtom';
// import functions
import { capitalize } from '@/lib/capitalize';
// import icons/images
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';
import noImage from '@/public/images/noImageAvailable.svg';

/**
 * Render a card for either album, playlist, artist, or track in top result
 * @function TopResultCard
 * @param {object} item (album, playlist, artist, or track)
 * @returns {JSX}
 */
function TopResultCard({ item }) {
  const spotifyApi = useSpotify();

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const setActivePlaylist = useSetRecoilState(activePlaylistState);
  const setCurrentTrackId = useSetRecoilState(currentTrackIdState);
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState);
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
      : '';

  /**
   * fetch playlist track & set TrackId state accordingly
   * @function getPlaylistTrack
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
    event.preventDefault();
    event.stopPropagation();
    let address, playPromise;
    setCurrentItemId(item.id);

    // set states when a track can play successfully
    const handlePlaybackSuccess = () => {
      console.log('Playback Success');
      setIsPlaying(true);
      setCurrentSongIndex(0); // top result is always the first item in array hence value zero
      setActivePlaylist(item.id);
      setActivePlaylist(null);
    };

    // check if current playing track matches the one chosen by the user
    // if "yes" pause if "no" play the new track selected
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (
        (item.type !== 'album' &&
          currentItemId === item.id &&
          data.body?.is_playing) ||
        (item.type === 'album' &&
          currentAlbumId === item.id &&
          data.body?.is_playing)
      ) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
            // setCurrentSongIndex(null);
            // setCurrentAlbumId(null);
            // setActivePlaylist(null);
          })
          .catch((err) => {
            console.error('Pause failed: ', err);
          });
      } else {
        if (item?.type === 'artist' || item?.type === 'track') {
          // if artist selected get tracks Uris & play in player
          if (item?.type === 'artist') {
            setCurrentAlbumId(null);
            if (spotifyApi.getAccessToken()) {
              playPromise = spotifyApi
                .getArtistTopTracks(item.id, ['US', 'FR'])
                .then((data) => {
                  setCurrentTrackId(data.body?.tracks[0]?.id); // will trigger playerInfo to update
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
            // if track selected get track Uri & play in player
          } else if (item?.type === 'track') {
            if (spotifyApi.getAccessToken()) {
              playPromise = spotifyApi
                .play({
                  uris: [item.uri],
                })
                .then(() => {
                  setCurrentTrackId(item.id); // will trigger playerInfo to update
                })
                .catch((err) => {
                  console.error('Track playback failed:', err);
                });
            }
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
  const activeStatus = useMemo(() => {
    return (currentItemId === item.id && isPlaying) ||
      (currentAlbumId === item.id && isPlaying)
      ? true
      : false;
  }, [currentAlbumId, currentItemId, isPlaying, item.id]);

  return (
    <Link href={linkAddress} className="group">
      <div className="relative p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out h-60">
        <Image
          className={`aspect-square shadow-image ${
            item?.type === 'artist' ? 'rounded-full' : 'rounded-md'
          }`}
          src={
            item?.images?.[0]?.url || item?.album?.images?.[0]?.url || noImage
          }
          alt=""
          width={100}
          height={100}
        />

        <button
          className={`absolute bottom-4 right-7 bg-black rounded-full shadow-3xl text-green-500 transition delay-100 duration-300 ease-in-out hover:scale-110 ${
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

        <h2 className="text-white capitalize mt-4 truncate text-xl md:text-2xl 2xl:text-3xl">
          {item?.name.replace('/', ' & ')}
        </h2>

        <div className="flex flex-wrap text-pink-swan mt-2">
          {/* album */}
          {item?.type === 'album' && (
            <>
              <span className="truncate">
                <span>{item?.release_date.slice(0, 4)}&nbsp;•&nbsp;</span>

                {item?.artists.slice(0, 2).map((item) => (
                  <span className="trucate mr-5" key={item?.id}>
                    {item?.name}.&nbsp;
                  </span>
                ))}
                <span className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px]">
                  {capitalize(item?.type)}
                </span>
              </span>
            </>
          )}

          {/* playlist*/}
          {item?.type === 'playlist' && (
            <>
              <span className="truncate mr-5">
                By {capitalize(item?.owner.display_name)}
              </span>
              <span className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px] truncate">
                {capitalize(item?.type)}
              </span>
            </>
          )}

          {/*artist*/}
          {item?.type === 'artist' && (
            <span className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px]">
              {capitalize(item?.type)}
            </span>
          )}

          {/* track */}
          {item?.type === 'track' && (
            <>
              <span className="truncate mr-5">
                {capitalize(item?.artists?.[0]?.name)}
              </span>
              <span className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px]">
                Song
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default TopResultCard;

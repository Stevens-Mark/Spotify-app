import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
  playlistIdState,
  playlistState,
  activePlaylistState,
  playlistNameState,
} from '@/atoms/playListAtom';
import {
  currentTrackIdState,
  currentTrackNameState,
  currentTrackTypeState,
  isPlayState,
} from '@/atoms/songAtom';
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
 * @returns {JSX}
 */
function Card({ item, type }) {
  const spotifyApi = useSpotify();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);
  // used to set play/pause icons
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentTrackName, setCurrentTrackName] = useRecoilState(
    currentTrackNameState
  );
  const [currentTrackType, setCurrentTrackType] = useRecoilState(
    currentTrackTypeState
  );
  const [currentPlaylistName, setcurrentPlaylistName] =
    useRecoilState(playlistNameState);
  const [firstTrackId, setFirstTrackId] = useState(null);
  const [firstTrackName, setFirstTrackName] = useState(null);
  const [firstTrackType, setFirstTrackType] = useState(null);
  const [firstPlaylistName, setFirstPlaylistName] = useState(null);
  const [uris, setUris] = useState(null); // for artist playback

  // fetch playlist track
  const getPlaylistTrack = async (playlistId, playlistName) => {
    try {
      const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 1 });
      const TrackId = data.body?.items[0]?.track.id;
      setCurrentTrackId(TrackId);
      setFirstTrackId(TrackId);
      setcurrentPlaylistName(playlistName);
      setFirstPlaylistName(playlistName);
      setCurrentTrackName(data.body?.items[0]?.track.name);
      setFirstTrackName(data.body?.items[0]?.track.name);
      setCurrentTrackType(type);
      setFirstTrackType(data.body?.items[0]?.track.type);
    } catch (err) {
      console.error('Error retrieving playlist track:');
    }
  };

  // fetch album track
  const getAlbumTrack = async (AlbumId) => {
    try {
      const data = await spotifyApi.getAlbumTracks(AlbumId, { limit: 1 });
      console.log(' getAlbumTrack ', data);
      const TrackId = data.body?.items[0]?.id;
      setCurrentTrackId(TrackId);
      setFirstTrackId(TrackId);
      setCurrentTrackName(data.body?.items[0]?.name);
      setFirstTrackName(data.body?.items[0]?.name);
      setCurrentTrackType(data.body?.items[0]?.type);
      setFirstTrackType(data.body?.items[0]?.type);
    } catch (err) {
      console.error('Error retrieving Album track:');
    }
  };

  // fetch artists tracks
  const getArtistTopTracks = (artistId, market) => {
    spotifyApi
      .getArtistTopTracks(artistId, market)
      .then((data) => {
        // Access the top track of the artist
        const TrackId = data.body?.tracks[0]?.id;
        const topTracks = data.body.tracks;
        const trackUris = topTracks.map((track) => track.uri);
        // set uris for playback
        setUris(trackUris);
        setCurrentTrackId(TrackId);
        setFirstTrackId(TrackId);
        setCurrentTrackName(data.body?.tracks[0]?.name);
        setFirstTrackName(data.body?.tracks[0]?.name);
        setCurrentTrackType(data.body?.tracks[0]?.type);
        setFirstTrackType(data.body?.tracks[0]?.type);
      })
      .catch((err) => {
        console.error('Error retrieving artist top tracks:');
      });
  };

  /* either play or pause current track */
  const HandleDetails = async (type, item) => {
    console.log('item', item);
    let address;
    if (type === 'playlist') {
      address = `spotify:playlist:${item.id}`;
      getPlaylistTrack(item.id, item.name);
    } else if (type === 'album') {
      address = `spotify:album:${item.id}`;
      getAlbumTrack(item.id);
    } else if (type === 'artist') {
      getArtistTopTracks(item.id, ['US', 'FR']);
    }

    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (
        (data.body?.is_playing &&
          firstTrackId === currentTrackId &&
          firstTrackName === currentTrackName &&
          firstTrackType === currentTrackType &&
          item?.uri === data.body?.context?.uri) ||
        (data.body?.is_playing &&
          firstTrackId === currentTrackId &&
          firstTrackName === currentTrackName &&
          firstTrackType === currentTrackType &&
          item?.id == data.body?.id) ||
        (data.body?.is_playing && firstPlaylistName === currentPlaylistName)
      ) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
          })
          .catch((err) => console.error('Pause failed: '));
      } else {
        if (spotifyApi.getAccessToken()) {
          spotifyApi
            .play({
              ...(type !== 'artist'
                ? { context_uri: address }
                : { uris: uris }),
              offset: { position: 0 },
              // ...(type !== 'artist' ? { offset: { position: 0 } } : {}),
            })
            .then(() => {
              console.log('Playback Success');
              setIsPlaying(true);
              // setCurrentTrackId(firstTrackId);
              // setActivePlaylist(item.id);
              // setCurrentTrackName(firstTrackName);
              // setCurrentTrackType(firstTrackType);
            })
            .catch((err) => console.error('Playback failed: ', err));
        }
      }
    });
  };

  // used to set play/pause icons
  const activeStatus = useMemo(() => {
    return (firstTrackId === currentTrackId &&
      firstTrackName === currentTrackName &&
      firstTrackType === currentTrackType &&
      isPlaying) ||
      (firstPlaylistName === currentPlaylistName &&
        firstTrackId === currentTrackId &&
        firstTrackName === currentTrackName &&
        isPlaying)
      ? true
      : false;
  }, [
    currentPlaylistName,
    currentTrackId,
    currentTrackName,
    currentTrackType,
    firstPlaylistName,
    firstTrackId,
    firstTrackName,
    firstTrackType,
    isPlaying,
  ]);

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
            onClick={() => {
              HandleDetails(type, item);
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

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
  playlistIdState,
  playlistState,
  activePlaylistState,
} from '@/atoms/playListAtom';
import { currentTrackIdState, isPlayState } from '@/atoms/songAtom';
// import icons/images
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import noImage from '@/public/images/noImageAvailable.svg';
// import functions
import { millisecondsToMinutes, getMonthYear } from '@/lib/time';
import { capitalize } from '@/lib/capitalize';

/**
 * Render a card for either album, playlist, podcast, artist, or recentsearch
 * @function Card
 * @param {object} item (album, playlist, podcast, artist, or recentsearch info)
 * @param {string} type of card
 * @returns {JSX}
 */
function Card({ item, type }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);
  const [firstTrackId, setFirstTrackId] = useState(null);

  const getPlaylistTrack = async (playlistId) => {
    try {
      const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 1 });
      const TrackId = data.body?.items[0]?.track.id;
      setCurrentTrackId(TrackId);
      setFirstTrackId(TrackId);
    } catch (err) {
      console.error('Error retrieving playlist track:', err);
    }
  };

  const getAlbumTrack = async (AlbumId) => {
    try {
      const data = await spotifyApi.getAlbumTracks(AlbumId, { limit: 1 });
      const TrackId = data.body?.items[0]?.id;
      setCurrentTrackId(TrackId);
      setFirstTrackId(TrackId);
    } catch (err) {
      console.error('Error retrieving Album track:', err);
    }
  };

  const [uris, setUris] = useState(null);
  const getArtistTopTracks = (artistId, market) => {
    spotifyApi
      .getArtistTopTracks(artistId, market)
      .then((data) => {
        // Access the top track of the artist
        const TrackId = data.body?.tracks[0]?.id;
        const topTracks = data.body.tracks;
        const trackUris = topTracks.map((track) => track.uri);
        setUris(trackUris);
        setCurrentTrackId(TrackId);
        setFirstTrackId(TrackId);
      })
      .catch((err) => {
        console.error('Error retrieving artist top tracks:', err);
      });
  };

  const HandleDetails = async (type, item) => {
    let address;
    if (type === 'playlist') {
      address = `spotify:playlist:${item.id}`;
      getPlaylistTrack(item.id);
    } else if (type === 'album') {
      address = `spotify:album:${item.id}`;
      getAlbumTrack(item.id);
    } else if (type === 'artist') {
      address = `spotify:artist:${item.id}`;

      getArtistTopTracks(item.id, ['US', 'FR']);
      // return;
    }
    // console.log('item ', item);
    // spotifyApi
    //   .getPlaylistTracks(item.id)
    //   .then((data) => {
    //     // Access the ID of the first track
    //     // console.log(data)
    //     const TrackId = data.body.items[0].track.id;
    //     console.log(TrackId);
    //     console.log('First track ID:', data.body.items[0].track.name);
    //     setCurrentTrackId(TrackId);
    //     setFirstTrackId(TrackId);
    //   })
    //   .catch((err) => {
    //     console.error('Error retrieving playlist tracks:', err);
    //   })
    //   .then(() => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (
        (data.body?.is_playing &&
          firstTrackId === currentTrackId &&
          item?.uri === data.body?.context?.uri) ||
        (data.body?.is_playing &&
          firstTrackId === currentTrackId &&
          item?.id !== data.body?.id)
      ) {
        spotifyApi
          .pause()
          .then(() => {
            setIsPlaying(false);
          })
          .catch((err) => console.error('Pause failed: ', err));
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
              setCurrentTrackId(firstTrackId);
              setActivePlaylist(item.id);
            })
            .catch((err) => console.error('Playback failed: ', err));
        }
      }
    });
    // });
  };

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
            className=" absolute bottom-24 right-7 bg-black rounded-full opacity-0 shadow-3xl text-green-500 group-hover:-translate-y-2 transition delay-100 duration-300 ease-in-out group-hover:opacity-100 hover:scale-110"
            onClick={() => {
              HandleDetails(type, item);
            }}
          >
            <PlayCircleIcon className="w-12 h-12 -m-2" />
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

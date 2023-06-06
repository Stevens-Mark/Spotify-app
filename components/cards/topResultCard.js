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
} from '@/atoms/playListAtom';
import {
  currentTrackIdState,
  currentSongIndexState,
  isPlayState,
} from '@/atoms/songAtom';
// import functions
import { capitalize } from '@/lib/capitalize';
// import icons/images
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';
import noImage from '@/public/images/noImageAvailable.svg';

/**
 * Render a card for either album, playlist, artist, or track in top result
 * @function TopResultCard
 * @param {object} item (album, playlist, artist, or track)
 * @param {string} type of card
 * @returns {JSX}
 */
function TopResultCard({ item, type }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const setCurrentSongIndex = useSetRecoilState(currentSongIndexState); // used to stop topsong duplicate? setting active status in this case
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayState);
  const [activePlaylist, setActivePlaylist] =
    useRecoilState(activePlaylistState);
  const [firstTrackId, setFirstTrackId] = useState(null);
  const [uris, setUris] = useState(null); // for artist playback
  const [cardActivated, setCardActivated] = useState(false); 

  // fetch playlist track
  const getPlaylistTrack = async (playlistId) => {
    try {
      const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 1 });
      const TrackId = data.body?.items[0]?.track.id;
      setCurrentTrackId(TrackId);
      setFirstTrackId(TrackId);
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
      setFirstTrackId(TrackId);
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
      })
      .catch((err) => {
        console.error('Error retrieving artist top tracks:');
      });
  };

  // set track
  const getTrack = (trackId) => {
    setCurrentTrackId(trackId);
    setFirstTrackId(trackId);
    setUris(item.uri);
  };

  /* either play or pause current track */
  const HandleDetails = async (type, item) => {
    let address;
    if (type === 'playlist') {
      address = `spotify:playlist:${item.id}`;
      getPlaylistTrack(item.id);
    } else if (type === 'album') {
      address = `spotify:album:${item.id}`;
      getAlbumTrack(item.id);
    } else if (type === 'artist') {
      // address = `spotify:artist:${item.id}`;
      getArtistTopTracks(item.id, ['US', 'FR']);
    } else if (type === 'track') {
      address = `${item.uri}`;
      console.log(address);
      // setUris(item.uri);
      getTrack(item.id);
    }

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
            // setCardActivated(false);
          })
          .catch((err) => console.error('Pause failed: '));
      } else {
        if (spotifyApi.getAccessToken()) {
          spotifyApi
            .play({
              ...(type === 'track' ? { uris: [uris] } : {}),
              // ...(type !== 'artist'
              //   ? { context_uri: address, offset: { position: 0 }, }
              //   : { uris: uris, offset: { position: 0 }, }),

              // offset: { position: 0 },
              // ...(type !== 'artist' ? { offset: { position: 0 } } : {}),
            })
            .then(() => {
              console.log('Playback Success');
              setIsPlaying(true);
              setCurrentTrackId(firstTrackId);
              setActivePlaylist(item.id);
              setCurrentSongIndex(null); // set null to stop topsong duplicate? setting active status
              // setCardActivated(true);
            })
            .catch((err) => console.error('Playback failed: ', err));
        }
      }
    });
  };

  // used to set play/pause icons
  const activeStatus = useMemo(() => {
    return firstTrackId === currentTrackId && isPlaying ? true : false;
  }, [currentTrackId, firstTrackId, isPlaying]);

  return (
    <Link href="" className="group">
      <div className="relative p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition delay-100 duration-300 ease-in-out h-60">
        <Image
          className={`aspect-square shadow-image ${
            type === 'artist' ? 'rounded-full' : 'rounded-md'
          }`}
          src={
            item?.images?.[0]?.url || item?.album?.images?.[0]?.url || noImage
          }
          alt=""
          width={100}
          height={100}
        />

        <button
          className={`absolute bottom-4 right-7 bg-black rounded-full shadow-3xl text-green-500 hover:scale-110 transition delay-100 duration-300 ease-in-out ${
            activeStatus
              ? '-translate-y-2'
              : 'opacity-0 group-hover:opacity-100 group-hover:-translate-y-2'
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

        <h2 className="text-white capitalize mt-4 truncate text-xl md:text-2xl 2xl:text-3xl">
          {item?.name.replace('/', ' & ')}
        </h2>

        <div className="flex flex-wrap text-pink-swan mt-2">
          {/* album */}
          {type === 'album' && (
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
          {type === 'playlist' && (
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
          {type === 'artist' && (
            <span className="text-white bg-zinc-800 rounded-3xl px-3 py-[0.5px]">
              {capitalize(item?.type)}
            </span>
          )}

          {/* track */}
          {type === 'track' && (
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

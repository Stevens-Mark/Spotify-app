import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
// import state management recoil
import { useSetRecoilState } from 'recoil';
import { playlistIdState, playlistTrackListState } from '@/atoms/playListAtom';
// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { msToTime } from '@/lib/time';
import { totalDuration } from '@/lib/totalTrackDuration';
import { capitalize } from '@/lib/capitalize';
import { analyseImageColor } from '@/lib/analyseImageColor.js';
// import icon/images
import Image from 'next/image';
import noAlbum from '@/public/images/noImageAvailable.svg';
import { colors } from '@/styles/colors';
// import components
import Layout from '@/components/layouts/Layout';
import PlaylistTracks from '@/components/trackListPlaylist/playlistTracks';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  const fetchPlaylist = async (id) => {
    try {
      const res = await fetch(` https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Playlist tracks:', err);
      return null;
    }
  };

  const playlist = await fetchPlaylist(id);

  return {
    props: {
      playlist,
    },
  };
}

/**
 * Renders Playlist page with tracks
 * @function PlaylistPage
 * @param {object} playlist
 * @returns {JSX}
 */
const PlaylistPage = ({ playlist }) => {
  const setCurrentPlaylistId = useSetRecoilState(playlistIdState);
  const setPlaylistTracklist = useSetRecoilState(playlistTrackListState);
  const [randomColor, setRandomColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState();

  useEffect(() => {
    setCurrentPlaylistId(playlist?.id);
    setPlaylistTracklist(playlist);
  }, [playlist, setCurrentPlaylistId, setPlaylistTracklist]);

  // analyse image colors for custom background & set default random background color (in case)
  useEffect(() => {
    setRandomColor(shuffle(colors).pop()); // default color tailwind (in case)
    const imageUrl = playlist?.images?.[0]?.url;
    if (imageUrl) {
      // custom background color (css style)
      analyseImageColor(imageUrl).then((dominantColor) => {
        setBackgroundColor(dominantColor);
      });
    } else {
      setBackgroundColor(null);
    }
  }, [playlist?.images]);

  return (
    <>
      <Head>
        <title>Spotify - Playlists</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        <div
          className={`flex flex-col justify-end xs:flex-row xs:justify-start xs:items-end space-x-0 xs:space-x-7 h-80 text-white py-4 px-5 xs:p-8 bg-gradient-to-b to-black ${
            backgroundColor !== null ? '' : randomColor
          }`}
          style={{
            background: `linear-gradient(to bottom, ${backgroundColor} 60%, #000000)`,
          }}
        >
          <Image
            className="h-16 w-16 xs:h-44 xs:w-44 ml-0 xs:ml-7 shadow-image2"
            src={playlist?.images?.[0]?.url || noAlbum}
            alt=""
            width={100}
            height={100}
            priority
          />
          <div>
            {playlist && (
              <div className="drop-shadow-text">
                <span className="pt-2">{capitalize(playlist?.type)}</span>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold pt-1 pb-[7px] line-clamp-1">
                  {playlist?.name}
                </h1>
                <p className=" text-sm mt-5 mb-2 line-clamp-2 text-pink-swan">
                  {playlist?.description}
                </p>
                <span>
                  {capitalize(playlist?.owner?.display_name)}&nbsp;•&nbsp;
                </span>
                <span>
                  {(playlist?.followers?.total).toLocaleString()}{' '}
                  likes&nbsp;•&nbsp;
                </span>
                <span className="text-sm">
                  {playlist?.tracks.items.length}{' '}
                  {playlist?.tracks.items.length > 1 ? 'songs' : 'song'},{' '}
                </span>
                <span className="text-sm truncate text-pink-swan">
                  {msToTime(totalDuration(playlist))}
                </span>
              </div>
            )}
          </div>
        </div>
        <section className="pb-20">
          <h2 className="sr-only">Track List</h2>
          <PlaylistTracks />
        </section>
      </div>
    </>
  );
};

export default PlaylistPage;

PlaylistPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

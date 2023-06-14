import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistTrackListState } from '@/atoms/playListAtom';
// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { msToTime } from '@/lib/time';
import { totalDuration } from '@/lib/totalTrackDuration';
import { capitalize } from '@/lib/capitalize';
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
      // session,
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

  console.log("playlstpage ", playlist)
  const [currentPlaylistId, setCurrentPlaylistId] =
    useRecoilState(playlistIdState);
  const [playlistTracklist, setPlaylistTracklist] = useRecoilState(
    playlistTrackListState
  );
  const [randomColor, setRandomColor] = useState(null);

  useEffect(() => {
    setRandomColor(shuffle(colors).pop());
    setCurrentPlaylistId(playlist?.id);
    setPlaylistTracklist(playlist);
  }, [playlist, setCurrentPlaylistId, setPlaylistTracklist]);

  return (
    <>
      <Head>
        <title>Playlists</title>
      </Head>
      <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        <div
          className={`flex flex-col justify-end sm:flex-row sm:justify-start sm:items-end space-x-7 bg-gradient-to-b to-black ${randomColor} h-80 text-white p-8`}
        >
          <Image
            className="h-16 w-16 sm:h-44 sm:w-44 shadow-2xl ml-7"
            src={playlist?.images?.[0]?.url || noAlbum}
            alt=""
            width={100}
            height={100}
            priority
          />
          <div>
            {playlist && (
              <>
                <p className="pt-2">{capitalize(playlist?.type)}</p>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold pb-5 pt-1 truncate">
                  {playlist?.name}
                </h1>
                <p className=" text-sm mb-2 line-clamp-2">{playlist?.description}</p>
                <span>{capitalize(playlist?.owner?.display_name)}&nbsp;•&nbsp;</span>
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
              </>
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

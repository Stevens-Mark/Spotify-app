import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
// import state management recoil
import { useSetRecoilState } from 'recoil';
import { playlistIdState, playlistTrackListState } from '@/atoms/playListAtom';
// import components
import Layout from '@/components/layouts/Layout';
import MediaHeading from '@/components/MediaHero';
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

  useEffect(() => {
    setCurrentPlaylistId(playlist?.id);
    setPlaylistTracklist(playlist);
  }, [playlist, setCurrentPlaylistId, setPlaylistTracklist]);

  return (
    <>
      <Head>
        <title>Spotify - Playlists</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        {/* Hero bar with image, playlist title etc */}
        <MediaHeading item={playlist} />

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

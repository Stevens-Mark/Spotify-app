import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useEffect, useRef } from 'react';
// import state management recoil
import { useSetRecoilState } from 'recoil';
import { playlistIdState, playlistTrackListState } from '@/atoms/playListAtom';
// custom hooks
import useScrollToTop from '@/hooks/useScrollToTop';
// import components
import Layout from '@/components/layouts/Layout';
import MediaHeading from '@/components/headerLabels/MediaHero';
import PlaylistTracks from '@/components/trackListPlaylist/playlistTracks';
import QuickPlayBanner from '@/components/player/QuickPlayBanner';
import Footer from '@/components/navigation/Footer';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

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
  const scrollRef = useRef(null);
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const setCurrentPlaylistId = useSetRecoilState(playlistIdState);
  const setPlaylistTracklist = useSetRecoilState(playlistTrackListState);

  useEffect(() => {
    setCurrentPlaylistId(playlist?.id);
    setPlaylistTracklist(playlist);
  }, [playlist, setCurrentPlaylistId, setPlaylistTracklist]);

  return (
    <>
      <Head>
        <title>Provided by Spotify - Playlists</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div
        className="flex-grow h-screen overflow-y-scroll scrollbar-hide"
        // ref={scrollRef}
        ref={(node) => {
          scrollRef.current = node;
          scrollableSectionRef.current = node;
        }}
      >
        {/* Hero bar with image, playlist title etc */}
        <MediaHeading item={playlist} />
        <QuickPlayBanner item={playlist} scrollRef={scrollRef} />

        <PlaylistTracks />
        {showButton && (
          <button
            className="fixed bottom-28 isSm:bottom-36 right-2 isSm:right-4 rounded-full hover:scale-110 duration-150 ease-in-out"
            onClick={scrollToTop}
          >
            <ArrowUpCircleIcon className="w-12 h-12 text-green-500" />
          </button>
        )}
        <Footer />
      </div>
    </>
  );
};

export default PlaylistPage;

PlaylistPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

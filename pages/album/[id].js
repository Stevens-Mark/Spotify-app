import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useEffect, useRef } from 'react';
// import state management recoil
import { useSetRecoilState } from 'recoil';
import { albumIdState, albumTrackListState } from '@/atoms/albumAtom';
// import components
import Layout from '@/components/layouts/Layout';
import MediaHeading from '@/components/headerLabels/MediaHero';
import AlbumTracks from '@/components/trackListAlbum/albumTracks';
import QuickPlayBanner from '@/components/player/QuickPlayBanner';
import Footer from '@/components/navigation/Footer';
// import functions
import { getMonthDayYear } from '@/lib/time';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  const fetchAlbum = async (id) => {
    try {
      const res = await fetch(` https://api.spotify.com/v1/albums/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Album tracks:', err);
      return null;
    }
  };

  const album = await fetchAlbum(id);

  return {
    props: {
      album,
    },
  };
}

/**
 * Renders Album page with tracks
 * @function AlbumPage
 * @param {object} album
 * @returns {JSX}
 */
const AlbumPage = ({ album }) => {
  const scrollRef = useRef(null);
  const setCurrentAlbumId = useSetRecoilState(albumIdState);
  const setAlbumTracklist = useSetRecoilState(albumTrackListState);

  console.log('album ', album);
  useEffect(() => {
    setCurrentAlbumId(album?.id);
    setAlbumTracklist(album);
  }, [album, setAlbumTracklist, setCurrentAlbumId]);

  return (
    <>
      <Head>
        <title>Spotify - Albums</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div
        className="flex-grow h-screen overflow-y-scroll scrollbar-hide"
        ref={scrollRef}
      >
        {/* Hero bar with image, album title & author etc */}
        <MediaHeading item={album} />
        <QuickPlayBanner item={album} scrollRef={scrollRef} />

        <AlbumTracks />

        {/* Release date & copyright information */}
        <aside className="px-8 text-pink-swan">
          <p>{getMonthDayYear(album?.release_date)}</p>
          {album?.copyrights.map((item, idx) => (
            <p key={idx} className="text-[12px]">
              {item?.text}
            </p>
          ))}
        </aside>
        <Footer />
      </div>
    </>
  );
};

export default AlbumPage;

AlbumPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

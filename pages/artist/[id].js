import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useEffect, useRef } from 'react';
// custom hooks
import useScrollToTop from '@/hooks/useScrollToTop';
// import state management recoil
import { useSetRecoilState } from 'recoil';
import { artistTrackListState, artistTrackUrisState } from '@/atoms/artistAtom';
// import components
import Layout from '@/components/layouts/Layout';
import MediaHeading from '@/components/headerLabels/MediaHero';
import ArtistTracks from '@/components/trackListArtist/artistTracks';
import QuickPlayBanner from '@/components/player/QuickPlayBanner';
import Footer from '@/components/navigation/Footer';
import BackToTopButton from '@/components/backToTopButton';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  const fetchArtistInfo = async (id) => {
    try {
      const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Artist information:', err);
      return null;
    }
  };

  const fetchArtistTracks = async (id) => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/artists/${id}/top-tracks?country=${countries.join(
          '&'
        )}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Artist tracks:', err);
      return null;
    }
  };

  const countries = ['US', 'FR'];
  const artistTracks = await fetchArtistTracks(id, countries);
  const artistInfo = await fetchArtistInfo(id);

  return {
    props: {
      artistInfo,
      artistTracks,
    },
  };
}

/**
 * Renders Artist page with tracks
 * @function ArtistPage
 * @param {object} artistInfo information about the artist
 * @param {object} artistTracks top 10 tracks
 * @returns {JSX}
 */
const ArtistPage = ({ artistInfo, artistTracks }) => {
  const scrollRef = useRef(null);
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const setArtistTracklist = useSetRecoilState(artistTrackListState);
  const setArtistTrackUris = useSetRecoilState(artistTrackUrisState);

  useEffect(() => {
    setArtistTracklist(artistTracks);
    setArtistTrackUris(artistTracks?.tracks?.map((track) => track.uri)); // set uris to be used in player
  }, [artistTracks, setArtistTrackUris, setArtistTracklist]);

  return (
    <>
      <Head>
        <title>Provided by Spotify - Artists</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div
        className="flex-grow h-screen overflow-y-scroll scrollbar-hide"
        ref={(node) => {
          scrollRef.current = node;
          scrollableSectionRef.current = node;
        }}
      >
        {/* Hero bar with image, artist title &  etc */}
        <MediaHeading item={artistInfo} itemTracks={artistTracks} />
        <QuickPlayBanner item={artistInfo} scrollRef={scrollRef} />

        <ArtistTracks />
        {/* Scroll to top button */}
        {showButton && <BackToTopButton scrollToTop={scrollToTop} />}
        <Footer />
      </div>
    </>
  );
};

export default ArtistPage;

ArtistPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

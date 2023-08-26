import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
// custom hooks
import useSpotify from '@/hooks/useSpotify';
import useScrollToTop from '@/hooks/useScrollToTop';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { artistsDiscographyState } from '@/atoms/artistAtom';
import { itemsPerPageState } from '@/atoms/otherAtoms';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import DiscographyCard from '@/components/cards/discographyCard';
import Footer from '@/components/navigation/Footer';
import BackToTopButton from '@/components/backToTopButton';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  const fetchArtistDiscography = async (id) => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/artists/${id}/albums?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Artist discography:', err);
      return null;
    }
  };

  const artistDiscography = await fetchArtistDiscography(id);

  return {
    props: {
      artistDiscography,
      id,
    },
  };
}

/**
 * Renders the artist discography page.
 * @function Discography
 * @param {Object} artistDiscograph artist discography
 * @param {string} id artists Id
 * @returns {JSX}
 */
function Discography({ artistDiscography, id }) {
  const spotifyApi = useSpotify();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const scrollRef = useRef(null);
  const itemsPerPage = useRecoilValue(itemsPerPageState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [stopFetch, setStopFetch] = useState(false);
  const [discography, setDiscography] = useRecoilState(artistsDiscographyState);

  useEffect(() => {
    setDiscography(artistDiscography.items);
  }, [artistDiscography, setDiscography]);

  // show message when all data loaded/end of infinite scrolling
  useEffect(() => {
    if (stopFetch) {
      toast.info("That's everything !", {
        theme: 'colored',
      });
    }
  }, [stopFetch]);

  /**
   * Fetches more albums & updates the discography list
   * @function fetchMoreData
   * @returns {object} updated discography list
   */
  const fetchMoreData = () => {
    if (!stopFetch) {
      const nextOffset = currentOffset + itemsPerPage;

      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .getArtistAlbums(id, {
            offset: nextOffset,
            limit: itemsPerPage,
          })
          .then(
            function (data) {
              setStopFetch(data?.body?.next === null);
              setDiscography((prevDiscography) => {
                const mergedList = [...prevDiscography, ...data.body?.items];

                // Remove duplicates based on item id
                const uniqueList = Array.from(
                  new Set(mergedList.map((item) => item?.id))
                ).map((id) => mergedList.find((item) => item.id === id));

                return uniqueList;
              });

              setCurrentOffset(nextOffset);
            },
            function (err) {
              console.log('Retrieving more items failed ...');
              toast.error('Retrieving more items failed !', {
                theme: 'colored',
              });
            }
          );
      }
    }
  };
  const containerRef = useInfiniteScroll(fetchMoreData);

  return (
    <>
      <Head>
        <title>Provided by Spotify - Discography</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div
        className="flex-grow h-screen overflow-y-scroll scrollbar-hide"
        ref={(node) => {
          containerRef.current = node;
          scrollRef.current = node;
          scrollableSectionRef.current = node;
        }}
      >
        <div className="flex flex-col mt-20">
          {discography?.map((item, i) => (
            <DiscographyCard key={`${item?.id}-${i}`} item={item} />
          ))}
        </div>
        {showButton && <BackToTopButton scrollToTop={scrollToTop} />}
        <Footer />
      </div>
    </>
  );
}

export default Discography;

Discography.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

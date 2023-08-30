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
import {
  discographyState,
  viewState,
  discographyToShowState,
} from '@/atoms/artistAtom';
import { itemsPerPageState } from '@/atoms/otherAtoms';
// import functions
// import { filterDiscography } from '@/lib/filterDiscography';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import DiscographyCard from '@/components/cards/discographyCard';
import Card from '@/components/cards/card';
import Footer from '@/components/navigation/Footer';
import BackToTopButton from '@/components/backToTopButton';
// import images/icons
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  const fetchArtistDiscography = async (id) => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/artists/${id}/albums?limit=14`,
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

const filterDiscography = (array, type) => {
  return array?.filter((item) => item?.album_type === type);
};

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
  const [discography, setDiscography] = useRecoilState(discographyState);
  const [toggle, setToggle] = useRecoilState(viewState);
  const discographyToShow = useRecoilValue(discographyToShowState);

// filter (or not) the discography & sort
  useEffect(() => {
    const filteredDiscography = artistDiscography.items.filter((item) => {
      if (discographyToShow === 'album') {
        return item.album_type === 'album';
      }
      if (discographyToShow === 'single') {
        return item.album_type === 'single';
      }
      return true; // No additional filtering for other cases
    });

    const sortedDiscography = filteredDiscography.sort((a, b) =>     // Sort  discography 
      a.release_date > b.release_date ? -1 : 1
    );

    setDiscography(sortedDiscography);
  }, [artistDiscography, discographyToShow, setDiscography]);

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
              const newData = data.body?.items || []; 
              let filteredNewData = newData;

              if (discographyToShow === 'album') {
                filteredNewData = filterDiscography(newData, 'album');
              } else if (discographyToShow === 'single') {
                filteredNewData = filterDiscography(newData, 'single');
              }

              setDiscography((prevDiscography) => {
                const mergedList = [...prevDiscography, ...filteredNewData];

                // Remove duplicates based on item id
                const uniqueList = Array.from(
                  new Set(mergedList.map((item) => item?.id))
                ).map((id) => mergedList.find((item) => item.id === id));

                const sorted = uniqueList.sort((a, b) =>     // Sort  discography 
                a.release_date > b.release_date ? -1 : 1
              );
                return sorted;
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

  // toggle between list/card view
  const handleView = () => {
    setToggle((prevState) => !prevState);
  };

  return (
    <>
      <Head>
        <title>Provided by Spotify - Discography</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div className="absolute top-0 left-0 w-full z-[25] h-32 bg-black shadow-elipsisMenu">
        <div className="absolute left-5 xs:left-9 bottom-5 w-full">
          <h1 className="text-white text-xl font-bold">
            {discography?.[0]?.artists?.[0]?.name}
          </h1>
          <button
            onClick={handleView}
            aria-label="change between list & card view"
            className="rounded-full text-pink-swan bg-gray-900 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white absolute -bottom-1 right-11 xs:right-14"
          >
            {toggle ? (
              <Squares2X2Icon className=" w-9 h-9 md:w-9 md:h-9 p-2" />
            ) : (
              <ListBulletIcon className=" w-9 h-9 md:w-9 md:h-9 p-2" />
            )}
          </button>
        </div>
      </div>
      <div
        className="flex-grow h-screen overflow-y-scroll scrollbar-hide"
        ref={(node) => {
          containerRef.current = node;
          scrollRef.current = node;
          scrollableSectionRef.current = node;
        }}
      >
        {toggle ? (
          <div className="flex flex-col mt-32">
            {discography?.map((item, i) => (
              <DiscographyCard
                key={`${item?.id}-${i}`}
                item={item}
                scrollRef={scrollRef}
              />
            ))}
          </div>
        ) : (
          <div className="px-5 xs:px-8 mt-32 grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {discography?.map((item, i) => (
              <Card key={`${item?.id}-${i}`} item={item} />
            ))}
          </div>
        )}

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

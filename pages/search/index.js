import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
// custom hooks
import useSpotify from '@/hooks/useSpotify';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useScrollToTop from '@/hooks/useScrollToTop';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { genreState } from '@/atoms/genreAtom';
import { itemsPerPageState } from '@/atoms/otherAtoms';
// import icons & components
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import RecentSearches from '@/components/Recent';
import GenreCard from '@/components/cards/genreCard';
import Footer from '@/components/navigation/Footer';
import BackToTopButton from '@/components/backToTopButton';

/**
 * Renders search page
 * @function Search
 * @returns {JSX}
 */
function Search() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const itemsPerPage = useRecoilValue(itemsPerPageState);
  const [genres, setGenres] = useRecoilState(genreState);
  const [currentOffset, setCurrentOffset] = useState(0); // Updated the initial value of currentOffset
  const [stopFetch, setStopFetch] = useState(false); // Updated the initial value of stopFetch

  useEffect(() => {
    if (genres === null) {
      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .getCategories({
            limit: itemsPerPage,
            offset: 0,
            country: 'US', // FR, US, GB
            locale: 'en_US', // fr_FR, en_US, en_GB
          })
          .then(
            function (data) {
              setGenres(data?.body?.categories?.items);
            },
            function (err) {
              console.log('Failed to get genres!');
              toast.error('Genre retrieval failed !', {
                theme: 'colored',
              });
            }
          );
      }
    }
  }, [genres, setGenres, spotifyApi, session, itemsPerPage]);

  // show message when all data loaded/end of infinite scrolling
  useEffect(() => {
    if (stopFetch) {
      toast.info(`That's all genres !`, {
        theme: 'colored',
      });
    }
  }, [stopFetch]);

  /**
   * Fetches more genres & updates the list of genres
   * @function fetchGenre
   * @returns {object} updated list of genres
   */
  // Function to fetch more genres when the user scrolls down
  const fetchGenre = () => {
    if (!stopFetch) {
      const nextOffset = currentOffset + itemsPerPage; // Calculate the next offset
      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .getCategories({
            limit: itemsPerPage,
            offset: nextOffset, // Use the next offset for fetching new data
            country: 'US', // FR, US, GB
            locale: 'en_US', // fr_FR, en_US, en_GB
          })
          .then(
            function (data) {
              // Check if there's no more data to fetch
              if (data?.body?.categories?.items?.length === 0) {
                setStopFetch(true);
                return; // Exit the function early if there are no more items
              }
              const updatedList = [...genres, ...data?.body?.categories?.items];
              // Always ensure there are no duplicate objects in the list of categories
              const genreList = updatedList.filter(
                (genre, index) =>
                  index ===
                  updatedList.findIndex((other) => genre.id === other.id)
              );
              setGenres(genreList);
              setCurrentOffset(nextOffset); // Update the currentOffset with the nextOffset
            },
            function (err) {
              console.log('Failed to get genres!');
              toast.error('Genre retrieval failed !', {
                theme: 'colored',
              });
            }
          );
      }
    }
  };

  const containerRef = useInfiniteScroll(fetchGenre);
  return (
    <div
      className="overflow-y-scroll h-screen text-white scrollbar-hide py-4 px-5 xs:px-8 pt-2 pb-24"
      ref={(node) => {
        containerRef.current = node;
        scrollableSectionRef.current = node;
      }}
    >
      <h1 className="sr-only">Search Page</h1>
      {/* Recent Searches list here */}
      <RecentSearches />
      <section className="pb-20">
        <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
          Browse all Genres
        </h2>
        <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
          {/* genres list here */}
          {genres?.map((item, idx) => (
            <GenreCard key={`${item?.id}-${idx}`} item={item} idx={idx} />
          ))}
        </div>

        {/* Scroll to top button */}
        {showButton && <BackToTopButton scrollToTop={scrollToTop} />}
      </section>
      <Footer />
    </div>
  );
}

export default Search;

Search.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

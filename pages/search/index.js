import React, { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import useSpotify from '@/hooks/useSpotify';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useScrollToTop from '@/hooks/useScrollToTop';
// import state management recoil
import { useRecoilState } from 'recoil';
import { genreState } from '@/atoms/genreAtom';
// import icons & components
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import RecentSearches from '@/components/Recent';
import GenreCard from '@/components/cards/genreCard';
import Footer from '@/components/navigation/Footer';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const fetchGenrelist = async () => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/browse/categories?country=US&limit=25`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving genre information: ', err);
      return null;
    }
  };

  const genreList = await fetchGenrelist();

  return {
    props: {
      genreList,
    },
  };
}

/**
 * Renders search page
 * @function Search
 * @param {object} genreList list of genre/categories
 * @returns {JSX}
 */
function Search({ genreList }) {
  const spotifyApi = useSpotify();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const [genres, setGenres] = useRecoilState(genreState);
  const [currentOffset, setCurrentOffset] = useState(25); // Updated the initial value of currentOffset
  const [stopFetch, setStopFetch] = useState(false); // Updated the initial value of stopFetch
  const itemsPerPage = 25;

  useEffect(() => {
    setGenres(genreList?.categories?.items);
  }, [genreList, setGenres]);

  // show message when all data loaded/end of infinite scrolling
  useEffect(() => {
    if (stopFetch) {
      toast.info(`That's all genres !`, {
        theme: 'colored',
      });
    }
  }, [genres?.length, stopFetch]);

  /**
   * Fetches more genres & updates the list of genres
   * @function fetchGenre
   * @returns {object} updated list of genres
   */
  const fetchGenre = () => {
    if (!stopFetch) {
      spotifyApi
        .getCategories({
          limit: itemsPerPage,
          offset: currentOffset,
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
            setCurrentOffset((prevOffset) => prevOffset + itemsPerPage); // Update the currentOffset using functional update
          },
          function (err) {
            console.log('Failed to get genres!');
          }
        );
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
          {genres?.slice(1).map((item, idx) => (
            <GenreCard key={`${item?.id}-${idx}`} item={item} idx={idx} />
          ))}
        </div>

        {showButton && (
          <button
            className="fixed bottom-28 isSm:bottom-36 right-2 isSm:right-4 rounded-full hover:scale-110 duration-150 ease-in-out"
            onClick={scrollToTop}
          >
            <ArrowUpCircleIcon className="w-12 h-12 text-green-500" />
          </button>
        )}
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

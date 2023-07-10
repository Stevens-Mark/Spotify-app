import React, { useEffect } from 'react';
import { useState } from 'react';
import useSpotify from '@/hooks/useSpotify';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useScrollToTop from '@/hooks/useScrollToTop';
// import state management recoil
import { useRecoilState } from 'recoil';
import { genreState } from '@/atoms/genreAtom';
// import component
import RecentSearches from './Recent';
import GenreCard from './cards/genreCard';
import Footer from '@/components/navigation/Footer';

import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

/**
 * Renders the list of genres & previous searches (if any).
 * @function Genre
 * @returns {JSX}
 */
function Genre() {
  const spotifyApi = useSpotify();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const [genres, setGenres] = useRecoilState(genreState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const itemsPerPage = 25;

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
              setGenres(data.body.categories.items);
            },
            function (err) {
              console.log('Failed to get genres!', err);
            }
          );
      }
    }
  });

  /**
   * Fetches more genres & updates the list of genres
   * @function fetchGenre
   * @returns {object} updated list of genres
   */
  const fetchGenre = () => {
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);
    spotifyApi
      .getCategories({
        limit: itemsPerPage,
        offset: nextOffset,
        country: 'US', // FR, US, GB
        locale: 'en_US', // fr_FR, en_US, en_GB
      })
      .then(
        function (data) {
          const updatedList = [...genres, ...data.body.categories.items];
          // Always ensure there are no dublicate objects in the list of categories
          const genreList = updatedList.filter(
            (genre, index) =>
              index === updatedList.findIndex((other) => genre.id === other.id)
          );
          setGenres(genreList);
        },
        function (err) {
          console.log('Failed to get genres!', err);
        }
      );
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

export default Genre;

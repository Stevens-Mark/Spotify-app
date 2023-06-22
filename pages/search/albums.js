import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import useSpotify from '@/hooks/useSpotify';
import useScrollToTop from '@/hooks/useScrollToTop';
// import state management recoil
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  searchResultState,
  queryState,
  searchingState,
} from '@/atoms/searchAtom';
import { errorState } from '@/atoms/errorAtom';
// import functions
import { mergeObject } from '@/lib/merge';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import Card from '@/components/cards/card';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

/**
 * Renders the list of Albums from search.
 * @function Albums
 * @returns {JSX}
 */
function Albums() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);
  const setIsSearching = useSetRecoilState(searchingState);
  const setIsError = useSetRecoilState(errorState);

  const albums = queryResults?.albums?.items;
  const totalNumber = queryResults?.albums?.total;
  const currentNumber = queryResults?.albums?.items.length;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  /**
   * Fetches more albums & updates the list of albums
   * @function fetchMoreData
   * @returns {object} updated list of albums in queryResults
   */
  const fetchMoreData = () => {
    const itemsPerPage = 30;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);
    setIsSearching(true);
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchAlbums(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergeObject(data.body, queryResults, 'albums');
            setQueryResults(updatedList);
            setIsSearching(false);
          },
          function (err) {
            setIsSearching(false);
            setIsError(true);
            console.log('Retrieving more items failed:', err);
          }
        );
    }
  };

  return (
    <section
      className="bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56"
      ref={scrollableSectionRef}
    >
      {totalNumber === 0 ? (
        <span className="flex items-center h-full justify-center">
          <h1 className="text-white text-2xl md:text-3xl 2xl:text-4xl">
            Sorry no Albums
          </h1>
        </span>
      ) : (
        <>
          {/* album list here */}
          <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
            Albums
          </h1>
          <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {albums?.map((item, i) => (
              <Card key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
          {totalNumber > currentNumber && (
            <span className="flex justify-end w-full mt-4">
              <button
                className="text-xl md:text-2xl2xl:text-3xl text-white hover:text-green-500"
                onClick={() => {
                  fetchMoreData();
                }}
              >
                <span>Add More</span>
              </button>
            </span>
          )}
        </>
      )}
      {showButton && (
        <button
          className="fixed bottom-28 isSm:bottom-36 right-2 isSm:right-4 rounded-full hover:scale-110 duration-150 ease-in-out"
          onClick={scrollToTop}
        >
          <ArrowUpCircleIcon className="w-12 h-12 text-green-500" />
        </button>
      )}
    </section>
  );
}

export default Albums;

Albums.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

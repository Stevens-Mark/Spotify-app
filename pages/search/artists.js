import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSpotify from '@/hooks/useSpotify';
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
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import Card from '@/components/cards/card';

/**
 * Renders the list of Artists from search.
 * @function Artists
 * @returns {JSX}
 */
function Artists() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);
  const setIsSearching = useSetRecoilState(searchingState);
  const setIsError = useSetRecoilState(errorState);

  const artists = queryResults?.artists?.items;
  const totalNumber = queryResults?.artists?.total;
  const currentNumber = queryResults?.artists?.items.length;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  /**
   * Fetches more Artists & updates the list of Artists
   * @function fetchMoreArtists
   * @returns {object} updated list of artists in queryResults
   */
  const fetchMoreArtists = () => {
    const itemsPerPage = 50;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);
    setIsSearching(true);
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchArtists(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergeObject(data.body, queryResults, 'artists');
            setQueryResults(updatedList);
            setIsSearching(false);
          },
          function (err) {
            setIsSearching(false);
            setIsError(true);
            console.log('Get more items failed:', err);
          }
        );
    }
  };

  return (
    <section className="bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56">
      {totalNumber === 0 ? (
        <span className="flex items-center h-full justify-center">
          <h1 className="text-white text-2xl md:text-3xl 2xl:text-4xl">
            Sorry no Artists
          </h1>
        </span>
      ) : (
        <>
          {/* artists list here */}
          <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
            Artists
          </h1>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {artists?.map((item, i) => (
              <Card key={`${item.id}-${i}`} type={'artist'} item={item} />
            ))}
          </div>
          {totalNumber > currentNumber && (
            <span className="flex justify-end w-full mt-4">
              <button
                className="text-xl md:text-2xl2xl:text-3xl text-white hover:text-green-500"
                onClick={() => {
                  fetchMoreArtists();
                }}
              >
                <span>Add More</span>
              </button>
            </span>
          )}
        </>
      )}
    </section>
  );
}

export default Artists;

Artists.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
4;

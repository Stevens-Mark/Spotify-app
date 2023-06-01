import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
// import functions
import { mergeObject } from '@/lib/merge';
// import layouts/components
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import Card from '@/components/cards/card';
/**
 * Renders the list of Playlists from search.
 * @function Playlists
 * @returns {JSX}
 */
function Playlists() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);

  const playlists = queryResults?.playlists?.items;
  const totalNumber = queryResults?.playlists?.total;
  const currentNumber = queryResults?.playlists?.items.length;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

    /**
   * merges next set of fetched Playlists into current Playlists list
   * @function mergedPlaylists
   * @param {object} data next set of fetched Playlists
   * @returns {object} updated queryResults
   */
  // const mergedPlaylists = (data) => {
  //   const existingItems = queryResults.playlists.items;
  //   const newItems = data.playlists.items.filter((newItem) => {
  //     return !existingItems.some(
  //       (existingPlaylist) => existingPlaylist.id == newItem.id
  //     );
  //   });

  //   const playlistsMerged = {
  //     playlists: {
  //       href: queryResults.playlists.href,
  //       items: existingItems.concat(newItems),
  //       limit: queryResults.playlists.limit,
  //       next: queryResults.playlists.next,
  //       offset: queryResults.playlists.offset,
  //       previous: queryResults.playlists.previous,
  //       total: queryResults.playlists.total,
  //     },
  //     albums: { ...queryResults.albums, ...data.albums },
  //     artists: { ...queryResults.artists, ...data.artists },
  //     episodes: { ...queryResults.episodes, ...data.episodes },
  //     shows: { ...queryResults.shows, ...data.shows },
  //     tracks: { ...queryResults.tracks, ...data.tracks },
  //   };
  //   return playlistsMerged;
  // };

  /**
   * Fetches more playlists & updates the list of playlists
   * @function fetchMorePlaylists
   * @returns {object} updated list of playlists in queryResults
   */
  const fetchMorePlaylists = () => {
    const itemsPerPage = 50;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchPlaylists(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            // const updatedList = mergedPlaylists(data.body);
            const updatedList = mergeObject(data.body, queryResults, 'playlists');
            setQueryResults(updatedList);
          },
          function (err) {
            console.log('Get more items failed:', err);
          }
        );
    }
  };

  return (
    <section className=" bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56">
      {totalNumber === 0 ? (
        <span className="flex items-center h-full justify-center">
          <h1 className="text-white text-2xl md:text-3xl 2xl:text-4xl">
            Sorry no playlists
          </h1>
        </span>
      ) : (
        <>
          {/* playlists list here */}
          <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
            Playlists
          </h1>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {playlists?.map((item, i) => (
              <Card key={`${item.id}-${i}`} type={'playlist'} item={item} />
            ))}
          </div>
          {totalNumber > currentNumber && (
            <span className="flex justify-end w-full mt-4">
              <button
                className="text-xl md:text-2xl2xl:text-3xl text-white hover:text-green-500"
                onClick={() => {
                  fetchMorePlaylists();
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

export default Playlists;

Playlists.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

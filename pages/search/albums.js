import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSpotify from '@/hooks/useSpotify';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
// import layouts
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import Card from '@/components/cards/card';

/**
 * Renders the list of Albums from search.
 * @function Albums
 * @returns {JSX}
 */
function Albums() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);

  const albums = queryResults?.albums?.items;
  const totalNumber = queryResults?.albums?.total;
  const currentNumber = queryResults?.albums?.items.length;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  /**
   * merges next set of fetched albums into current album list
   * @function mergeAlbums
   * @param {object} data next set of fetched albums
   * @returns {object} updated queryResults
   */
  const mergeAlbums = (data) => {
    console.log(data);
    const existingItems = queryResults.albums.items;
    const newItems = data.albums.items.filter((newItem) => {
      return !existingItems.some(
        (existingAlbum) => existingAlbum.name == newItem.name
      );
    });

    const albumMerged = {
      albums: {
        href: queryResults.albums.href,
        items: existingItems.concat(newItems),
        limit: queryResults.albums.limit,
        next: queryResults.albums.next,
        offset: queryResults.albums.offset,
        previous: queryResults.albums.previous,
        total: queryResults.albums.total,
      },
      artists: { ...queryResults.artists, ...data.artists },
      episodes: { ...queryResults.episodes, ...data.episodes },
      playlists: { ...queryResults.playlists, ...data.playlists },
      shows: { ...queryResults.shows, ...data.shows },
      tracks: { ...queryResults.tracks, ...data.tracks },
    };
    return albumMerged;
  };

  /**
   * Fetches more albums & updates the list of albums
   * @function fetchMoreAlbums
   * @returns {object} updated list of albums in queryResults
   */
  const fetchMoreAlbums = () => {
    const itemsPerPage = 50;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchAlbums(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergeAlbums(data.body);
            setQueryResults(updatedList);
          },
          function (err) {
            console.log('Get more album items failed:', err);
          }
        );
    }
  };

  return (
    <section className="bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56">
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
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {albums?.map((item, i) => (
              <Card key={`${item.id}-${i}`} type={'album'} item={item} />
            ))}
          </div>
          {totalNumber > currentNumber && (
            <span className="flex justify-end w-full mt-4">
              <button
                className="text-xl md:text-2xl2xl:text-3xl text-white hover:text-green-500"
                onClick={() => {
                  fetchMoreAlbums();
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

export default Albums;

Albums.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

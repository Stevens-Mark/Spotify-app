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

function Artists() {
  const spotifyApi = useSpotify();
  const router = useRouter();
  const [queryResults, setQueryResults] = useRecoilState(searchResultState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const query = useRecoilValue(queryState);

  const artists = queryResults?.artists?.items;
  const totalNumber = queryResults?.artists?.total;
  const currentNumber = queryResults?.artists?.items.length;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  const mergedArtists = (data) => {
    const existingItems = queryResults.artists.items;
    const newItems = data.artists.items.filter((newItem) => {
      return !existingItems.some(
        (existingArtists) => existingArtists.id == newItem.id
      );
    });

    const artistsMerged = {
      artists: {
        href: queryResults.artists.href,
        items: existingItems.concat(newItems),
        limit: queryResults.artists.limit,
        next: queryResults.artists.next,
        offset: queryResults.artists.offset,
        previous: queryResults.artists.previous,
        total: queryResults.artists.total,
      },
      albums: { ...queryResults.albums, ...data.albums },
      episodes: { ...queryResults.episodes, ...data.episodes },
      playlists: { ...queryResults.playlists, ...data.playlists },
      shows: { ...queryResults.shows, ...data.shows },
      tracks: { ...queryResults.tracks, ...data.tracks },
    };
    return artistsMerged;
  };

  const fetchMoreArtists = () => {
    const itemsPerPage = 50;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);

    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .searchArtists(query, {
          offset: nextOffset,
          limit: itemsPerPage,
        })
        .then(
          function (data) {
            const updatedList = mergedArtists(data.body);
            setQueryResults(updatedList);
          },
          function (err) {
            console.log('Get more items failed:', err);
          }
        );
    }
  };

  return (
    <div className="bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56">
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
    </div>
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

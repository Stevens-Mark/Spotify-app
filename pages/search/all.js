import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
// import state management recoil
import { useRecoilValue } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
// import layouts
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import Card from '@/components/cards/card';

/**
 * Renders the list of All options from search.
 * @function All
 * @returns {JSX}
 */
function All() {
  const router = useRouter();
  const queryResults = useRecoilValue(searchResultState);
  const query = useRecoilValue(queryState);

  const artists = queryResults?.artists?.items;
  const totalArtists = queryResults?.artists?.total;
  const albums = queryResults?.albums?.items;
  const totalAlbums = queryResults?.albums?.total;
  const playlists = queryResults?.playlists?.items;
  const totalPlaylists = queryResults?.playlists?.total;
  const shows = queryResults?.shows?.items;
  const totalShows = queryResults?.shows?.total;
  const episodes = queryResults?.episodes?.items;
  const totalEpisodes = queryResults?.episodes?.total;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  /* control number of cards shown depending on screen width */
  const isX2LGlitch = useMediaQuery({
    minWidth: '1536px',
    maxWidth: '1680px',
  });

  const isXXXl = useMediaQuery({
    minWidth: '1681px',
    maxWidth: '3840px',
  });

  const isXXl = useMediaQuery({
    minWidth: '1281px',
    maxWidth: '1680px',
  });

  const isXl = useMediaQuery({
    minWidth: '1024px',
    maxWidth: '1280px',
  });
  const isLg = useMediaQuery({
    minWidth: '768px',
    maxWidth: '1024px',
  });
  const isMd = useMediaQuery({
    minWidth: '640px',
    maxWidth: '767px',
  });
  const isSm = useMediaQuery({
    minWidth: '525px',
    maxWidth: '690px',
  });

  let numOfItems = 7; // Default number of items

  switch (true) {
    case isXXXl:
      numOfItems = 7;
      break;
    case isX2LGlitch:
      numOfItems = 7;
      break;
    case isXXl:
      numOfItems = 6;
      break;
    case isXl:
      numOfItems = 5;
      break;
    case isLg:
      numOfItems = 3;
      break;
    case isMd:
      numOfItems = 4;
      break;
    case isSm:
      numOfItems = 3;
      break;
    default:
      numOfItems = 2; // default minimum number of items 2
      break;
  }

  return (
    <div className="bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56">
      <h1 className="sr-only">All Search Results</h1>
      {totalArtists === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Artists
          </h2>
          <h3 className="text-white mb-10">Sorry no Artists</h3>
        </section>
      ) : (
        <section className="mb-9">
          {/*  artists list */}
          <div className="flex items-center justify-between">
            <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
              Artists
            </h2>
          </div>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {artists?.slice(0, numOfItems).map((item, i) => (
              <Card key={`${item.id}-${i}`} type={'artist'} item={item} />
            ))}
          </div>
        </section>
      )}
      {totalAlbums === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Albums
          </h2>
          <h3 className="text-white mb-10">Sorry no Albums</h3>
        </section>
      ) : (
        <section className="mb-9">
          {/*  albums list */}
          <div className="flex items-center justify-between">
            <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
              Albums
            </h2>
          </div>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {albums?.slice(0, numOfItems).map((item, i) => (
              <Card key={`${item.id}-${i}`} type={'album'} item={item} />
            ))}
          </div>
        </section>
      )}
      {totalPlaylists === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Playlists
          </h2>
          <h3 className="text-white mb-10">Sorry no Playlists</h3>
        </section>
      ) : (
        <section className="mb-9">
          {/*  playlists list */}
          <div className="flex items-center justify-between">
            <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
              Playlists
            </h2>
          </div>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {playlists?.slice(0, numOfItems).map((item, i) => (
              <Card key={`${item.id}-${i}`} type={'playlist'} item={item} />
            ))}
          </div>
        </section>
      )}
      {totalShows === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Podcast & Shows
          </h2>
          <h3 className="text-white mb-10">Sorry no Podcast & Shows</h3>
        </section>
      ) : (
        <section className="mb-9">
          {/*  shows/podcasts list */}
          <div className="flex items-center justify-between">
            <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
              Podcast & Shows
            </h2>
          </div>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {shows?.slice(0, numOfItems).map((item, i) => (
              <Card key={`${item.id}-${i}`} type={'podcast'} item={item} />
            ))}
          </div>
        </section>
      )}
      {totalEpisodes === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Episodes
          </h2>
          <h3 className="text-white mb-10">Sorry no Episodes</h3>
        </section>
      ) : (
        <section className="mb-9">
          {/* episodes list */}
          <div className="flex items-center justify-between">
            <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
              Episodes
            </h2>
          </div>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {episodes?.slice(0, numOfItems).map((item, i) => (
              <Card key={`${item.id}-${i}`} type={'episode'} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default All;

All.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

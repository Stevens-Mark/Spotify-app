import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
// import state management recoil
import { useRecoilValue } from 'recoil';
import {
  searchResultState,
  queryState,
  topResultState,
} from '@/atoms/searchAtom';
// import layouts
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import TopResult from '../../components/topResult';
import Card from '@/components/cards/card';
import TopSongs from '@/components/topSongs';

/**
 * Renders the list of All options from search.
 * @function All
 * @returns {JSX}
 */
function All() {
  const router = useRouter();
  const queryResults = useRecoilValue(searchResultState);
  const query = useRecoilValue(queryState);
  const topResults = useRecoilValue(topResultState);

  const topResult =
    topResults?.tracks?.items ||
    topResults?.albums?.items ||
    topResults?.playlists?.items ||
    topResults?.artists?.items;
  const topSongs = topResults?.tracks?.items?.length;

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

  // if no query go back to main search page
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
      <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 lg:gap-6">
        <section className="col-start-1 row-start-1 col-span-1 xxs:col-span-2 h-full mb-9">
          <>
            {topResult?.length === 0 ? (
              <>
                <h2 className="text-white my-5 mr-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
                  Top Result
                </h2>
                <div className="p-4 rounded-lg bg-gray-900 h-60 flex justify-center items-center">
                  <h3 className="text-white">Sorry no Top Results</h3>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-white my-5 mr-5 text-2xl md:text-3xl 2xl:text-4xl">
                  Top Result
                </h2>
                <TopResult />
              </>
            )}
          </>
        </section>
        <section className="col-start-1 row-start-2 col-span-1 xxs:col-span-2 isSm:col-span-4 lg:row-start-1 lg:col-span-5 mb-9">
          <>
            {topSongs < 1 ? (
              <>
                <h2 className="text-white my-5 mr-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
                  Songs
                </h2>
                <div className="p-4 rounded-lg bg-gray-900 h-60 flex justify-center items-center">
                  <h3 className="text-white">Sorry no Songs</h3>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-white my-5 mr-5 text-2xl md:text-3xl 2xl:text-4xl">
                  Songs
                </h2>
                <div className=" rounded-lg bg-gray-900">
                  <TopSongs />
                </div>
              </>
            )}
          </>
        </section>
      </div>

      {totalArtists === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Artists
          </h2>
          <div className="p-4 rounded-lg bg-gray-900 h-60 flex justify-center items-center">
            <h3 className="text-white">Sorry no Artists</h3>
          </div>
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
              <Card key={`${item.id}-${i}`} item={item} order={i} />
            ))}
          </div>
        </section>
      )}
      {totalAlbums === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Albums
          </h2>
          <div className="p-4 rounded-lg bg-gray-900 h-60 flex justify-center items-center">
            <h3 className="text-white">Sorry no Albums</h3>
          </div>
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
              <Card key={`${item.id}-${i}`} item={item} order={i} />
            ))}
          </div>
        </section>
      )}
      {totalPlaylists === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Playlists
          </h2>
          <div className="p-4 rounded-lg bg-gray-900 h-60 flex justify-center items-center">
            <h3 className="text-white">Sorry no Playlists</h3>
          </div>
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
              <Card key={`${item.id}-${i}`} item={item} order={i} />
            ))}
          </div>
        </section>
      )}
      {totalShows === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Podcasts
          </h2>
          <div className="p-4 rounded-lg bg-gray-900 h-60 flex justify-center items-center">
            <h3 className="text-white">Sorry no Podcasts</h3>
          </div>
        </section>
      ) : (
        <section className="mb-9">
          {/*  shows/podcasts list */}
          <div className="flex items-center justify-between">
            <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
              Podcasts
            </h2>
          </div>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {shows?.slice(0, numOfItems).map((item, i) => (
              <Card key={`${item.id}-${i}`} item={item} order={i}/>
            ))}
          </div>
        </section>
      )}
      {totalEpisodes === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Episodes
          </h2>
          <div className="p-4 rounded-lg bg-gray-900 h-60 flex justify-center items-center">
            <h3 className="text-white">Sorry no Episodes</h3>
          </div>
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
              <Card key={`${item.id}-${i}`} item={item} order={i} />
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

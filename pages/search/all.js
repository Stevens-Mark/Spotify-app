import Head from 'next/head';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import useScrollToTop from '@/hooks/useScrollToTop';
import useNumOfItems from '@/hooks/useNumberOfItems'; //control number of cards shown depending on screen width
// import state management recoil
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { episodesListState, episodesUrisState } from '@/atoms/showAtom';
import {
  searchResultState,
  queryState,
  topResultState,
} from '@/atoms/searchAtom';
import { songsUrisState, songsListState } from '@/atoms/songAtom';
// import layouts
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import TopResult from '../../components/topResult';
import Card from '@/components/cards/card';
import TopSongs from '@/components/topSongs';
import Footer from '@/components/navigation/Footer';
import BackToTopButton from '@/components/addRemoveButtons/backToTopButton';

/**
 * Renders the list of All options from search.
 * @function All
 * @returns {JSX}
 */
function All() {
  const router = useRouter();
  const numOfItems = useNumOfItems();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const queryResults = useRecoilValue(searchResultState);
  const query = useRecoilValue(queryState);
  const topResults = useRecoilValue(topResultState);
  const setEpisodesUris = useSetRecoilState(episodesUrisState); // episodes uris (from search)
  const setEpisodesList = useSetRecoilState(episodesListState); // episodes list (from search)
  const setSongsUris = useSetRecoilState(songsUrisState); // song uris (from search)
  const setsongsList = useSetRecoilState(songsListState); // songs list (from search)

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
  const tracks = queryResults?.tracks?.items;

  useEffect(() => {
    setEpisodesList(episodes);
    if (episodes) {
      const uris = episodes?.map((item) => item.uri);
      setEpisodesUris(uris);
    }
  }, [episodes, queryResults, setEpisodesList, setEpisodesUris]);

  // create the lists (removing duplicates)
  useEffect(() => {
    if (tracks) {
      const uniqueTracks = Array.from(
        new Set(tracks.map((track) => track.uri))
      ).map((uri) => tracks.find((track) => track.uri === uri));
      setsongsList(uniqueTracks); // songs list (from search)

      const uniqueUris = uniqueTracks.map((track) => track.uri);
      setSongsUris(uniqueUris); // set uris (from search) to be used in player
    }
  }, [queryResults, setsongsList, setSongsUris, tracks]);

  // if no query go back to main search page
  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  return (
    <>
      <Head>
        <title>Provided by Spotify - All Search Results</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div
        className="bg-black overflow-y-scroll h-screen scrollbar-hide py-4 px-5 xs:px-8 pt-2  pb-24"
        ref={scrollableSectionRef}
      >
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
                  <TopSongs />
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
            <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {artists?.slice(0, numOfItems).map((item, i) => (
                <Card key={`${item.id}-${i}`} item={item} />
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
            <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {albums?.slice(0, numOfItems).map((item, i) => (
                <Card key={`${item.id}-${i}`} item={item} />
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
            <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {playlists?.slice(0, numOfItems).map((item, i) => (
                <Card key={`${item.id}-${i}`} item={item} />
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
            <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {shows?.slice(0, numOfItems).map((item, i) => (
                <Card key={`${item.id}-${i}`} item={item} />
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
            <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {episodes?.slice(0, numOfItems).map((item, i) => (
                <Card key={`${item.id}-${i}`} item={item} />
              ))}
            </div>
          </section>
        )}
        {/* Scroll to top button */}
        {showButton && <BackToTopButton scrollToTop={scrollToTop} />}
        <Footer />
      </div>
    </>
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

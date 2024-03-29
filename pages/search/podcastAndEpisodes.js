import Head from 'next/head';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import useScrollToTop from '@/hooks/useScrollToTop';
import useNumOfItems from '@/hooks/useNumberOfItems'; //control number of cards shown depending on screen width
// import state management recoil
import { useRecoilValue } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
// import layouts
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import Card from '@/components/cards/card';
import EpisodeCard from '@/components/cards/episodeCard';
import Footer from '@/components/navigation/Footer';
import BackToTopButton from '@/components/backToTopButton';

/**
 * Renders the list of Shows/Podcasts & Episodes from search.
 * @function PodcastAndEpisodes
 * @returns {JSX}
 */
function PodcastAndEpisodes() {
  const router = useRouter();
  const numOfItems = useNumOfItems();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const queryResults = useRecoilValue(searchResultState);
  const query = useRecoilValue(queryState);

  const shows = queryResults?.shows?.items;
  const totalShows = queryResults?.shows?.total;
  const episodes = queryResults?.episodes?.items;
  const totalEpisodes = queryResults?.episodes?.total;

  useEffect(() => {
    if (!query) {
      router.push('/search');
    }
  }, [query, router]);

  const handlePodcasts = () => {
    router.push('/search/shows');
  };

  const handleEpisodes = () => {
    router.push('/search/episodes');
  };

  return (
    <>
      <Head>
        <title>
          Provided by Spotify - Results for Podcasts/Shows & Episodes
        </title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div
        className="bg-black overflow-y-scroll h-screen scrollbar-hide py-4 px-5 xs:px-8 pt-2 pb-24"
        ref={scrollableSectionRef}
      >
        <h1 className="sr-only">
          Search Results for Podcasts, Shows & Episodes
        </h1>
        {totalShows === 0 ? (
          <section>
            <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
              No Podcasts & Shows
            </h2>
            <div className="p-4 rounded-lg bg-gray-900 h-60 flex justify-center items-center">
              <h3 className="text-white">Sorry no Shows/Podcasts</h3>
            </div>
          </section>
        ) : (
          <section>
            {/* first seven shows/postcasts list */}
            <div className="flex items-center justify-between">
              <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
                Podcasts & Shows
              </h2>
              <button
                className="mb-5 text-sm md:text-xl text-white hover:text-green-500"
                onClick={() => {
                  handlePodcasts();
                }}
              >
                <span>show all</span>
              </button>
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
          <section>
            {/* first twenty-five esisodes list */}
            <div className="flex items-center justify-between mt-4">
              <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
                Episodes
              </h2>
              <button
                className="mb-5 text-sm md:text-xl text-white hover:text-green-500"
                onClick={() => {
                  handleEpisodes();
                }}
              >
                <span>show all</span>
              </button>
            </div>
            <div className="flex flex-col">
              {episodes?.slice(0, 30).map((track, i) => (
                <EpisodeCard key={`${track.id}-${i}`} track={track} order={i} />
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

export default PodcastAndEpisodes;

PodcastAndEpisodes.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

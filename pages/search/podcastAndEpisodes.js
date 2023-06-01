import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchResultState, queryState } from '@/atoms/searchAtom';
// import layouts
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import Card from '@/components/cards/card';
import EpisodeCard from '@/components/cards/episodeCard';

/**
 * Renders the list of Podcasts & Episodes from search.
 * @function PodcastAndEpisodes
 * @returns {JSX}
 */
function PodcastAndEpisodes() {
  const router = useRouter();
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
    router.push('/search/podcasts');
  };

  const handleEpisodes = () => {
    router.push('/search/episodes');
  };

  return (
    <div className="bg-black overflow-y-scroll h-screen scrollbar-hide px-8 pt-2 pb-56">
      <h1 className="sr-only">Podcasts, Shows & Episodes</h1>
      {totalShows === 0 ? (
        <section>
          <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Podcasts & Shows
          </h2>
          <h3 className="text-white mb-10">Sorry no Shows/Podcasts</h3>
        </section>
      ) : (
        <section>
          {/* first seven shows/postcasts list */}
          <div className="flex items-center justify-between">
            <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
              Podcasts & Shows
            </h2>
            <button
              className="mb-5 text-xl md:text-2xl2xl:text-3xl text-white hover:text-green-500"
              onClick={() => {
                handlePodcasts();
              }}
            >
              <span>show all</span>
            </button>
          </div>
          <div className="grid xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {shows?.slice(0, 7).map((item, i) => (
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
        <section>
          {/* first twenty-five esisodes list */}
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
              Episodes
            </h2>
            <button
              className="mb-5 text-xl md:text-2xl2xl:text-3xl text-white hover:text-green-500"
              onClick={() => {
                handleEpisodes();
              }}
            >
              <span>show all</span>
            </button>
          </div>
          <div className="flex flex-col">
            {episodes?.slice(0, 25).map((item, i) => (
              <EpisodeCard key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
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

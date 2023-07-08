import React from 'react';
import Card from '@/components/cards/card';
import EpisodeCard from '@/components/cards/episodeCard';
// import Footer from '../Footer';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { capitalize } from '@/lib/capitalize';

/**
 * Renders a list from search: Playlists, albums,etc ...
 * @function MediaResultList
 * @param {Object} props - Component props
 * @returns {JSX}
 */
function MediaResultList(props) {
  const {
    mediaList,
    totalNumber,
    showButton,
    scrollToTop,
    containerRef,
    scrollableSectionRef,
  } = props;

  return (
    <>
      <div
        className="bg-black overflow-y-scroll h-screen scrollbar-hide py-4 px-5 xs:px-8 pt-2 pb-56"
        ref={(node) => {
          containerRef.current = node;
          scrollableSectionRef.current = node;
        }}
      >
        {totalNumber === 0 ? (
          <span className="flex items-center h-full justify-center">
            <h1 className="text-white text-2xl md:text-3xl 2xl:text-4xl">
              Sorry no items found
            </h1>
          </span>
        ) : (
          <>
            {/* list here */}
            <h1 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
              {mediaList?.[0].type && <>{capitalize(mediaList?.[0].type)}s</>}
            </h1>

            {mediaList?.[0].type === 'episode' ? (
              <div className="flex flex-col">
                {mediaList?.map((track, i) => (
                  <EpisodeCard
                    key={`${track.id}-${i}`}
                    track={track}
                    order={i}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                {mediaList?.map((item, i) => (
                  <Card key={`${item.id}-${i}`} item={item} />
                ))}
              </div>
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
 
      </div>

    </>
  );
}

export default MediaResultList;

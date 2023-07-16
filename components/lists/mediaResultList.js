import React from 'react';
import Card from '@/components/cards/card';
import EpisodeCard from '@/components/cards/episodeCard';
import Footer from '@/components/navigation/Footer';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { capitalize } from '@/lib/capitalize';
import SongTracks from '../trackListSongs/songTracks';
import GenreHeading from '../headerLabels/GenreHeading';

/**
 * Renders a list from search: Playlists, albums,etc ...
 * @function MediaResultList
 * @param {Object} props - Component props
 * @returns {JSX}
 */
function MediaResultList(props) {
  const {
    heading,
    error,
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
        className={`bg-black overflow-y-scroll h-screen scrollbar-hide pt-2 pb-24 py-4  ${
          mediaList?.[0]?.type === 'track' ? 'px-0' : 'px-5 xs:px-8'
        }`}
        ref={(node) => {
          containerRef.current = node;
          scrollableSectionRef.current = node;
        }}
      >
        {!error && (
          <>
            {heading ? (
              <>
              <h1 className="text-white text-3xl xs:text-4xl sm:text-5xl 2xl:text-8xl mt-28 mb-16">
                {heading}
              </h1>
              <GenreHeading heading={heading} scrollRef={scrollableSectionRef}/>
              </>
            ) : (
              <h1 className="sr-only">
                Search results for{' '}
                {mediaList?.[0]?.type && (
                  <>{capitalize(mediaList?.[0].type)}s</>
                )}
              </h1>
            )}
          </>
        )}
        {totalNumber === 0 || error ? (
          <span className="flex items-center h-full justify-center">
            <h2 className="text-white text-2xl md:text-3xl 2xl:text-4xl">
              Sorry no items available
            </h2>
          </span>
        ) : (
          <>
            {/* visible title if not track list page & no specific heading */}
            {!heading && mediaList?.[0]?.type !== 'track' && (
              <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl">
                {mediaList?.[0]?.type && (
                  <>{capitalize(mediaList?.[0]?.type)}s</>
                )}
              </h2>
            )}
            {/* track list here */}
            {mediaList?.[0]?.type === 'track' && <SongTracks />}

            {/* or episode list here */}
            {mediaList?.[0]?.type === 'episode' && (
              <div className="flex flex-col">
                {mediaList?.map((track, i) => (
                  <EpisodeCard
                    key={`${track?.id}-${i}`}
                    track={track}
                    order={i}
                  />
                ))}
              </div>
            )}
            {/* otherwise playlist, album or artists list here */}
            {mediaList?.[0]?.type !== 'episode' &&
              mediaList?.[0]?.type !== 'track' && (
                <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                  {mediaList?.map((item, i) => (
                    <Card key={`${item?.id}-${i}`} item={item} />
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
        <Footer />
      </div>
    </>
  );
}

export default MediaResultList;

import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import useScrollToTop from '@/hooks/useScrollToTop';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
// import state management recoil
import { useSetRecoilState, useRecoilState } from 'recoil';
import {
  showEpisodesUrisState,
  showEpisodesListState,
  showEpisodeIdState,
} from '@/atoms/showAtom';
// import icons
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
// import components
import Layout from '@/components/layouts/Layout';
import MediaHeading from '@/components/headerLabels/MediaHero';
import ShowTracks from '@/components/trackListShow/showTracks';
import QuickPlayBanner from '@/components/player/QuickPlayBanner';
import Footer from '@/components/navigation/Footer';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  const fetchShowInfo = async (id) => {
    try {
      const res = await fetch(`https://api.spotify.com/v1/shows/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Show information:', err);
      return null;
    }
  };

  const showInfo = await fetchShowInfo(id);

  return {
    props: {
      showInfo,
    },
  };
}

/**
 * Renders Artist page with tracks
 * @function ShowPage
 * @param {object} showInfo information about the show
 * @returns {JSX}
 */
const ShowPage = ({ showInfo }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const textRef = useRef(null);
  const scrollRef = useRef(null);
  const { id } = router.query;
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const [lastShowEpisodeId, setLastShowEpisodeId] =
    useRecoilState(showEpisodeIdState); // show episodes Id

  const setShowEpisodesUris = useSetRecoilState(showEpisodesUrisState); // episodes uris from a SHOW
  const setShowEpisodesList = useSetRecoilState(showEpisodesListState); // episodes list from a SHOW
  const [currentOffset, setCurrentOffset] = useState(0); // offset for data fetch
  const [expandABoutText, setExpandABoutText] = useState(false); // show expand/collapse About text
  const [expandABoutButton, setExpandABoutButton] = useState(false); // show/hide see more/less button

  useEffect(() => {
    // avoid epsisode list being reset on page reload & if user edit URL with invalid ID
    if (lastShowEpisodeId === id) {
      setShowEpisodesList((prevEpisodesList) => {
        // check it's array before performing any operation (avoid TypeError)
        if (Array.isArray(prevEpisodesList)) {
          const mergedList = [
            ...prevEpisodesList,
            ...showInfo?.episodes?.items,
          ];
          // Remove duplicates
          const uniqueList = Array.from(
            new Set(mergedList.map((item) => item?.id))
          ).map((id) => mergedList.find((item) => item.id === id));
          return uniqueList;
        } else {
          return showInfo?.episodes?.items; // if not array assign value directly
        }
      });

      // avoid uris list being reset on page reload & if user edit URL with invalid ID
      setShowEpisodesUris((prevUris) => {
        // check it's array before performing any operation (avoid TypeError)
        if (Array.isArray(prevUris)) {
          const mergedUris = [
            ...prevUris,
            ...showInfo?.episodes?.items?.map((track) => track.uri),
          ];
          // Remove duplicates
          const uniqueUris = Array.from(new Set(mergedUris));
          return uniqueUris;
        } else {
          return showInfo?.episodes?.items?.map((track) => track.uri); // if not array assign value directly
        }
      });
    } else {
      setShowEpisodesList(showInfo?.episodes?.items);
      setShowEpisodesUris(showInfo?.episodes?.items?.map((track) => track.uri)); // set uris to be used in player
    }
    setLastShowEpisodeId(id);
  }, [
    id,
    lastShowEpisodeId,
    setLastShowEpisodeId,
    setShowEpisodesList,
    setShowEpisodesUris,
    showInfo?.episodes?.items,
  ]);

  // calculate if About text is more than 4 lines high ?
  // if not, hide see more button as not needed
  useEffect(() => {
    const textElement = textRef.current;
    if (textElement) {
      const lineCount =
        textElement.clientHeight /
        parseInt(getComputedStyle(textElement).lineHeight);
      setExpandABoutButton(lineCount < 4 ? false : true);
    }
  }, []);

  // show expand/collapse About text
  const expandABoutTextToggle = () => {
    setExpandABoutText((prevState) => !prevState);
  };

  /**
   * Fetches more show episodes/uris & updates the lists
   * @function fetchMoreData
   * @returns {object} updated list in showEpisodesUris/showEpisodesList
   */
  const fetchMoreData = () => {
    const itemsPerPage = 25;
    const nextOffset = currentOffset + itemsPerPage;
    setCurrentOffset(nextOffset);
    fetch(
      `https://api.spotify.com/v1/shows/${id}/episodes?offset=${nextOffset}&limit=${itemsPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const { items } = data;
        // Update the ShowEpisodesList by merging the new episodes
        setShowEpisodesList((prevEpisodesList) => [
          ...prevEpisodesList,
          ...items,
        ]);
        // Extract the URIs of the new episodes
        const newUris = items.map((track) => track.uri);
        // Update the ShowEpisodesUris by merging the new URIs
        setShowEpisodesUris((prevUris) => [...prevUris, ...newUris]);
      })
      .catch((err) => {
        console.error('Retrieving more items failed:', err);
      });
  };
  const containerRef = useInfiniteScroll(fetchMoreData); // infinite scroll load more data

  return (
    <>
      <Head>
        <title>Spotify - Shows</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div
        className="flex-grow h-screen overflow-y-scroll scrollbar-hide"
        ref={(node) => {
          containerRef.current = node;
          scrollableSectionRef.current = node;
          scrollRef.current = node;
        }}
      >
        {/* Hero bar with image, podcast title & author etc */}
        <MediaHeading item={showInfo} />
        <QuickPlayBanner item={showInfo} scrollRef={scrollRef} />
        <section>
          <h2 className="sr-only">Show Episodes List</h2>
          <div className="flex  flex-col-reverse xl:flex-row gap-9 py-4 px-5 xs:p-10">
            <div className=" w-[100%] xl:w-[70%]">
              <ShowTracks />
            </div>
            <div className="flex-1 px-2 max-w-2xl">
              <h2 className="text-white text-xl md:text-2xl xl:text-3xl mb-5">
                About
              </h2>
              {/* if there is a html description use it: links open in seperate page to avoid hydration issues */}
              {showInfo?.html_description ? (
                <div
                  ref={textRef}
                  className={`text-pink-swan  ${
                    !expandABoutText ? 'line-clamp-4' : ''
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: showInfo?.html_description.replace(
                      /<a(.*?)>/gi,
                      '<a$1 target="_blank" rel="noopener noreferrer">'
                    ),
                  }}
                />
              ) : (
                <p
                  ref={textRef}
                  className={`text-pink-swan links ${
                    !expandABoutText ? 'line-clamp-4' : ''
                  }`}
                >
                  {showInfo?.description}
                </p>
              )}

              {expandABoutButton && (
                <button
                  className="mt-3 text-sm md:text-lg text-white hover:text-green-500"
                  onClick={expandABoutTextToggle}
                >
                  {!expandABoutText ? '... See more' : 'See less'}
                </button>
              )}
            </div>
          </div>
          {showButton && (
            <button
              className="fixed bottom-28 isSm:bottom-36 right-2 isSm:right-4 rounded-full hover:scale-110 duration-150 ease-in-out"
              onClick={scrollToTop}
            >
              <ArrowUpCircleIcon className="w-12 h-12 text-green-500" />
            </button>
          )}
        </section>
        <Footer />
      </div>
    </>
  );
};

export default ShowPage;

ShowPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

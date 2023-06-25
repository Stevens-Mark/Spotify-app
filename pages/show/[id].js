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
// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { capitalize } from '@/lib/capitalize';
import { analyseImageColor } from '@/lib/analyseImageColor.js';
// import icon/images
import Image from 'next/image';
import noArtist from '@/public/images/noImageAvailable.svg';
import { colors } from '@/styles/colors';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
// import components
import Layout from '@/components/layouts/Layout';
import ShowTracks from '@/components/trackListShow/showTracks';

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
  // console.log('showinfo ', showInfo);
  const { data: session } = useSession();
  const router = useRouter();
  const textRef = useRef(null);
  const { id } = router.query;
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const [lastShowEpisodeId, setLastShowEpisodeId] =
    useRecoilState(showEpisodeIdState); // show episodes Id

  const setShowEpisodesUris = useSetRecoilState(showEpisodesUrisState); // episodes uris from a SHOW
  const setShowEpisodesList = useSetRecoilState(showEpisodesListState); // episodes list from a SHOW
  const [currentOffset, setCurrentOffset] = useState(0); // offset for data fetch
  const [randomColor, setRandomColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState();
  const [expandABoutText, setExpandABoutText] = useState(false); // show expand/collapse About text
  const [expandABoutButton, setExpandABoutButton] = useState(false); // show/hide see more/less button

  useEffect(() => {
    // avoid epsisode list being reset on page reload
    if (lastShowEpisodeId === id) {
      setShowEpisodesList((prevEpisodesList) => {
        const mergedList = [...prevEpisodesList, ...showInfo.episodes.items];
        // Remove duplicates
        const uniqueList = Array.from(
          new Set(mergedList.map((item) => item.id))
        ).map((id) => mergedList.find((item) => item.id === id));
        return uniqueList;
      });
      // avoid uris list being reset on page reload
      setShowEpisodesUris((prevUris) => {
        const mergedUris = [
          ...prevUris,
          ...showInfo.episodes.items.map((track) => track.uri),
        ];
        // Remove duplicates
        const uniqueUris = Array.from(new Set(mergedUris));
        return uniqueUris;
      });
    } else {
      setShowEpisodesList(showInfo.episodes.items);
      setShowEpisodesUris(showInfo.episodes.items.map((track) => track.uri)); // set uris to be used in player
    }
    setLastShowEpisodeId(id);
  }, [
    id,
    lastShowEpisodeId,
    setLastShowEpisodeId,
    setShowEpisodesList,
    setShowEpisodesUris,
    showInfo.episodes.items,
  ]);

  // analyse image colors for custom background & set default random background color (in case)
  useEffect(() => {
    setRandomColor(shuffle(colors).pop());
    const imageUrl = showInfo?.images?.[0]?.url;
    if (imageUrl) {
      analyseImageColor(imageUrl).then((dominantColor) => {
        setBackgroundColor(dominantColor);
      });
    } else {
      setBackgroundColor(null);
    }
  }, [showInfo?.images]);

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
    const itemsPerPage = 30;
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
        }}
      >
        <div
          className={`flex flex-col justify-end xs:flex-row xs:justify-start xs:items-end space-x-0 xs:space-x-7 h-80 text-white py-4 px-5 xs:p-8 bg-gradient-to-b to-black ${
            backgroundColor !== null ? '' : randomColor
          }`}
          style={{
            background: `linear-gradient(to bottom, ${backgroundColor} 60%, #000000)`,
          }}
        >
          <Image
            className="h-16 w-16 xs:h-44 xs:w-44 ml-0 xs:ml-7 shadow-image2"
            src={showInfo?.images?.[0]?.url || noArtist}
            alt=""
            width={100}
            height={100}
            priority
          />
          <div>
            {showInfo && (
              <div className="drop-shadow-text">
                <span className="pt-2">{capitalize(showInfo?.type)}</span>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold pt-1 pb-[7px] line-clamp-1">
                  {showInfo?.name}
                </h1>
                <span className="text-sm mt-5 mb-2 line-clamp-2">
                  {capitalize(showInfo?.publisher)}
                </span>
              </div>
            )}
          </div>
        </div>
        <section className="pb-24">
          <h2 className="sr-only">Track List</h2>
          <div className="flex  flex-col-reverse xl:flex-row gap-9 py-4 px-5 xs:p-10">
            <div className=" w-[100%] xl:w-[70%]">
              <ShowTracks />
            </div>
            <div className="flex-1 px-2 max-w-2xl">
              <h2 className="text-white text-xl md:text-2xl xl:text-3xl mb-5">
                About
              </h2>
              <p
                ref={textRef}
                className={`text-pink-swan  ${
                  !expandABoutText ? 'line-clamp-4' : ''
                }`}
              >
                {showInfo?.description}
              </p>
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
      </div>
    </>
  );
};

export default ShowPage;

ShowPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

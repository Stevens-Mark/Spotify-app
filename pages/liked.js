import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';
// custom hooks
import useScrollToTop from '@/hooks/useScrollToTop';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
// import state management recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import { likedListState, likedUrisState } from '@/atoms/songAtom';
// import components
import Layout from '@/components/layouts/Layout';
import MediaHeading from '@/components/headerLabels/MediaHero';
import QuickPlayBanner from '@/components/player/QuickPlayBanner';
import Footer from '@/components/navigation/Footer';
import LikedTracks from '@/components/trackListLiked/likedTracks';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const fetchLiked = async () => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/tracks?limit=${30}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving liked tracks:', err);
      return null;
    }
  };

  const likedTracks = await fetchLiked();

  return {
    props: {
      likedTracks,
    },
  };
}

/**
 * Renders Users Liked Songs
 * @function LikedPage
 * @param {object}  likedTracks information about user's liked tracks
 * @returns {JSX}
 */
const LikedPage = ({ likedTracks }) => {
  const { data: session } = useSession();

  likedTracks.id = 'liked';
  likedTracks.type = 'liked';
  likedTracks.name = 'Liked Songs';
  likedTracks.publisher= session?.user.name;
  likedTracks.images = [
    {
      height: 640,
      url: '/images/LikedSongs.png',
      width: 640,
    },
  ];
  
  // const scrollRef = useRef(null);
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const [likedTracklist, setLikedTracklist] = useRecoilState(likedListState);
  const [likedTrackUris, setLikedTrackUris] = useRecoilState(likedUrisState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [stopFetch, setStopFetch] = useState(false);

  useEffect(() => {
    setLikedTracklist(likedTracks?.items?.map((item) => item.track));
    setLikedTrackUris(likedTracks?.items?.map((item) => item.track.uri)); // set uris to be used in player
  }, [likedTracks?.items, setLikedTrackUris, setLikedTracklist]);

  // show message when all data loaded/end of infinite scrolling
  useEffect(() => {
    if (stopFetch) {
      toast.info("That's everything !", {
        theme: 'colored',
      });
    }
  }, [stopFetch]);

  console.log('likedtracks', likedTracks);
  /**
   * Fetches more liked songs & updates the list of liked songs
   * @function fetchMoreData
   * @returns {object} updated list of liked songs
  //  */
  const fetchMoreData = async () => {
    if (!stopFetch) {
      const itemsPerPage = 30;
      const nextOffset = currentOffset + itemsPerPage;
      console.log('next offset', nextOffset);
      try {
        const res = await fetch(
          `https://api.spotify.com/v1/me/tracks?offset=${nextOffset}&limit=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        const data = await res.json();
        // Check if there's no more data to fetch
        if (data?.items?.length === 0) {
          setStopFetch(true);
          return; // Exit the function early if there are no more items
        }

        // Extract the new track objects and URIs from the fetched data
        const newTracks = data?.items?.map((item) => item.track);
        const newUris = data?.items?.map((item) => item.track.uri);

        // Merge the new track objects with the existing likedTracklist array after removing duplicates
        setLikedTracklist((prevLikedTracklist) => {
          const mergedList = [...prevLikedTracklist, ...newTracks];
          const uniqueItems = Array.from(
            new Set(mergedList.map((track) => track.uri))
          ).map((uri) => mergedList.find((track) => track.uri === uri));
          return uniqueItems;
        });

        // Merge the new URIs with the existing likedTrackUris array after removing duplicates
        setLikedTrackUris((prevLikedTrackUris) => {
          const mergedUris = [...prevLikedTrackUris, ...newUris];
          return Array.from(new Set(mergedUris));
        });

        setCurrentOffset(nextOffset);
      } catch (err) {
        console.error('Retrieving more items failed ...', err);
        toast.error('Retrieving more items failed!', {
          theme: 'colored',
        });
        return null;
      }
    }
  };

  const scrollRef = useInfiniteScroll(fetchMoreData);

  return (
    <>
      <Head>
        <title>Liked Songs</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div
        className="flex-grow h-screen overflow-y-scroll scrollbar-hide"
        // ref={scrollRef}
        ref={(node) => {
          // containerRef.current = node;
          scrollableSectionRef.current = node;
          scrollRef.current = node;
        }}
      >
        {/* Hero bar, quickplayer & tracks etc */}
        <MediaHeading item={likedTracks} />
        <QuickPlayBanner item={likedTracks} scrollRef={scrollRef} />
        <LikedTracks />

        {/* Scroll to top button */}
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
};

export default LikedPage;

LikedPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

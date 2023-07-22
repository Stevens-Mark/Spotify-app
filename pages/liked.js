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
      data.id = 'collection';
      data.type = 'collection';
      data.name = 'Liked Songs';
      data.publisher = session?.user.name;
      data.images = [
        {
          height: 640,
          url: '/images/LikedSongs.png',
          width: 640,
        },
      ];

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

// Helper function to merge and remove duplicates from the new data
const mergeAndRemoveDuplicates = (existingData, newData) => {
  const mergedData = [...existingData];
  const addedTrackUris = new Set(existingData.map((item) => item.track.uri));

  for (const newItem of newData) {
    const newItemUri = newItem.track.uri;
    if (!addedTrackUris.has(newItemUri)) {
      mergedData.push(newItem);
      addedTrackUris.add(newItemUri);
    }
  }
  return mergedData;
};

/**
 * Renders Users Liked Songs
 * @function LikedPage
 * @param {object}  likedTracks information about user's liked tracks
 * @returns {JSX}
 */
const LikedPage = ({ likedTracks }) => {
  const { data: session } = useSession();

  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const [likedTracklist, setLikedTracklist] = useRecoilState(likedListState);
  const setLikedTrackUris = useSetRecoilState(likedUrisState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [stopFetch, setStopFetch] = useState(false);

  useEffect(() => {
    setLikedTracklist(likedTracks);
    setLikedTrackUris(likedTracks?.items?.map((item) => item.track.uri)); // set uris to be used in player
  }, [likedTracks, setLikedTrackUris, setLikedTracklist]);

  // show message when all data loaded/end of infinite scrolling
  useEffect(() => {
    if (stopFetch) {
      toast.info("That's everything !", {
        theme: 'colored',
      });
    }
  }, [stopFetch]);

  // Function to fetch more data when the user scrolls down
  const fetchMoreData = async () => {
    if (!stopFetch) {
      // If we reached the end, don't fetch more
      const itemsPerPage = 30;
      const nextOffset = currentOffset + itemsPerPage;

      try {
        const res = await fetch(
          `https://api.spotify.com/v1/me/tracks?offset=${nextOffset}&limit=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.items.length === 0) {
            // If there's no more data, set stopFetch to true
            setStopFetch(true);
          } else {
            // Merge the new data with the existing data and remove duplicates
            setLikedTracklist((prev) => ({
              ...prev,
              items: mergeAndRemoveDuplicates(prev.items, data.items),
            }));

            // Update the likedTrackUris with the new URIs
            setLikedTrackUris((prev) => {
              // Convert the previous URIs to a Set for faster lookups
              const existingUris = new Set(prev);
              // Filter out duplicates from newItems by checking against existingUris
              const newTrackUris = data.items
                .filter((item) => !existingUris.has(item.track.uri))
                .map((item) => item.track.uri);
              // Combine the existing URIs and the new URIs to form the new uris list
              return [...prev, ...newTrackUris];
            });
          }
        } else {
          console.error('Error fetching more liked tracks:');
          toast.error('Liked Songs retrieval failed !', {
            theme: 'colored',
          });
        }
      } catch (err) {
        console.error('Error fetching more liked tracks:');
        toast.error('Liked Songs retrieval failed !', {
          theme: 'colored',
        });
      }
      setCurrentOffset(nextOffset);
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
        ref={(node) => {
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

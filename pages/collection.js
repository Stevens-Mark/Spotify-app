import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';
// custom hooks
import useSpotify from '@/hooks/useSpotify';
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
import BackToTopButton from '@/components/backToTopButton';

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   const fetchLiked = async () => {
//     try {
//       const res = await fetch(
//         `https://api.spotify.com/v1/me/tracks?limit=${25}`,
//         {
//           headers: {
//             Authorization: `Bearer ${session.user.accessToken}`,
//           },
//         }
//       );
//       const data = await res.json();
//       // add this information to allow us to create the media banner for liked songs
//       data.id = 'collection';
//       data.type = 'collection';
//       data.name = 'Liked Songs';
//       data.owner = {
//         display_name: session?.user.name,
//         id: session?.user?.username,
//       };
//       data.images = [
//         {
//           height: 640,
//           url: '/images/LikedSongs.png',
//           width: 640,
//         },
//       ];
// console.log("feteched ", data)
//       return data;
//     } catch (err) {
//       console.error('Error retrieving liked tracks:', err);
//       return null;
//     }
//   };

//   const likedTracks = await fetchLiked();

//   return {
//     props: {
//       likedTracks,
//     },
//   };
// }

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
 * @function LikedPage (collection)
 * @param {object} likedTracks information about user's liked tracks
 * @returns {JSX}
 */
const LikedPage = () => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const scrollRef = useRef(null);
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const [likedTracks, setLikedTracklist] = useRecoilState(likedListState);
  const setLikedTrackUris = useSetRecoilState(likedUrisState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [stopFetch, setStopFetch] = useState(false);

  // useEffect(() => {
  //   setLikedTracklist(likedTracks);
  //   setLikedTrackUris(likedTracks?.items?.map((item) => item.track.uri)); // set uris to be used in player
  // }, [likedTracks, setLikedTrackUris, setLikedTracklist]);

  // show message when all data loaded/end of infinite scrolling
  useEffect(() => {
    if (stopFetch) {
      toast.info("That's everything !", {
        theme: 'colored',
      });
    }
  }, [stopFetch]);

  useEffect(() => {
    // Get Current User's Liked Song Tracks
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getMySavedTracks({
          limit: 25,
          offset: 0,
        })
        .then(
          function (data) {
            // add this information to allow us to create the media banner for liked songs
            data.body.id = 'collection';
            data.body.type = 'collection';
            data.body.name = 'Liked Songs';
            data.body.owner = {
              display_name: session?.user.name,
              id: session?.user?.username,
            };
            data.body.images = [
              {
                height: 640,
                url: '/images/LikedSongs.png',
                width: 640,
              },
            ];
            console.log("data ",data.body)
            setLikedTracklist(data.body);
            setLikedTrackUris(data.body?.items?.map((item) => item.track.uri)); // set uris to be used in player
          },
          function (err) {
            console.log('Something went wrong!', err);
          }
        );
    }
  }, [session, setLikedTrackUris, setLikedTracklist, spotifyApi]);

  // Function to fetch more data when the user scrolls down
  const fetchMoreData = async () => {
    if (!stopFetch) {
      // If we reached the end, don't fetch more
      const itemsPerPage = 25;
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

  const containerRef = useInfiniteScroll(fetchMoreData);

  return (
    <>
      <Head>
        <title>Provided by Spotify -Liked Songs</title>
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
        {/* Hero bar, quickplayer & tracks etc */}
        <MediaHeading item={likedTracks} />
        <QuickPlayBanner item={likedTracks} scrollRef={scrollRef} />
        <LikedTracks />

        {/* Scroll to top button */}
        {showButton && <BackToTopButton scrollToTop={scrollToTop} />}
        <Footer />
      </div>
    </>
  );
};

export default LikedPage;

LikedPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

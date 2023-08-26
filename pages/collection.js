import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
// custom hooks
import useSpotify from '@/hooks/useSpotify';
import useScrollToTop from '@/hooks/useScrollToTop';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
// import state management recoil
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import {
  likedListState,
  likedUrisState,
  updatetriggerLikedSongState,
} from '@/atoms/songAtom';
import { itemsPerPageState } from '@/atoms/otherAtoms';
import { playlistIdState } from '@/atoms/playListAtom';
// import components
import Layout from '@/components/layouts/Layout';
import MediaHeading from '@/components/headerLabels/MediaHero';
import QuickPlayBanner from '@/components/player/QuickPlayBanner';
import Footer from '@/components/navigation/Footer';
import LikedTracks from '@/components/trackListLiked/likedTracks';
import BackToTopButton from '@/components/addRemoveButtons/backToTopButton';

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
 * @returns {JSX}
 */
const LikedPage = () => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const scrollRef = useRef(null);
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button
  const setCurrentPlaylistId = useSetRecoilState(playlistIdState);
  const itemsPerPage = useRecoilValue(itemsPerPageState);
  const [likedTracks, setLikedTracklist] = useRecoilState(likedListState);
  const setLikedTrackUris = useSetRecoilState(likedUrisState);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [stopFetch, setStopFetch] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useRecoilState(
    updatetriggerLikedSongState
  );

  // show message when all data loaded/end of infinite scrolling
  useEffect(() => {
    if (stopFetch) {
      toast.info("That's everything !", {
        theme: 'colored',
      });
    }
  }, [stopFetch]);

  useEffect(() => {
    setCurrentPlaylistId(likedTracks?.id);
  }, [likedTracks?.id, setCurrentPlaylistId]);

  useEffect(() => {
    // Get Current User's Liked Song Tracks (if not loaded yet or needs update after track added/removed from likedsongs list)
    if (likedTracks === null || triggerUpdate) {
      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .getMySavedTracks({
            limit: itemsPerPage,
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

              setCurrentPlaylistId(data?.body?.id);
              setLikedTracklist(data?.body);
              setLikedTrackUris(
                data.body?.items?.map((item) => item.track.uri)
              ); // set uris to be used in player
            },
            function (err) {
              console.log('Songs retrieval failed !');
              toast.error('Songs retrieval failed !', {
                theme: 'colored',
              });
            }
          );
      }
    }
  }, [
    itemsPerPage,
    likedTracks,
    session,
    setCurrentPlaylistId,
    setLikedTrackUris,
    setLikedTracklist,
    setTriggerUpdate,
    spotifyApi,
    triggerUpdate,
  ]);

  // Function to fetch more data when the user scrolls down
  const fetchMoreData = () => {
    if (triggerUpdate) {
      setTriggerUpdate(false); // if list updated (see above): need to reset states
      setCurrentOffset(0);
      setStopFetch(false);
    } else if (!stopFetch) {
      const nextOffset = currentOffset + itemsPerPage; // Calculate the next offset
      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .getMySavedTracks({
            limit: itemsPerPage,
            offset: nextOffset, // Use the next offset for fetching new data
          })
          .then(
            function (data) {
              // Check if there's no more data to fetch
              if (data?.body?.items?.length === 0) {
                setStopFetch(true); // Set stopFetch to true if there are no more items
                return; // Exit the function early if there are no more items
              }

              // Merge the new data with the existing data and remove duplicates
              setLikedTracklist((prev) => ({
                ...prev,
                items: mergeAndRemoveDuplicates(prev.items, data?.body?.items),
              }));

              // Update the likedTrackUris with the new URIs
              setLikedTrackUris((prev) => {
                // Convert the previous URIs to a Set for faster lookups
                const existingUris = new Set(prev);
                // Filter out duplicates from newItems by checking against existingUris
                const newTrackUris = data?.body?.items
                  .filter((item) => !existingUris.has(item.track.uri))
                  .map((item) => item.track.uri);
                // Combine the existing URIs and the new URIs to form the new uris list
                return [...prev, ...newTrackUris];
              });

              setCurrentOffset(nextOffset); // Update the currentOffset with the nextOffset
            },
            function (err) {
              console.log('Songs retrieval failed !');
              toast.error('Songs retrieval failed !', {
                theme: 'colored',
              });
            }
          );
      }
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

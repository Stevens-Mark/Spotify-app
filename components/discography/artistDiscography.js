import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
import useNumOfItems from '@/hooks/useNumberOfItems'; //control number of cards shown depending on screen width
// import state management recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  discographyToShowState,
  artistsDiscographyState,
  singlesDiscographyState,
  albumsDiscographyState,
  lastArtistIdState,
} from '@/atoms/artistAtom';
// import functions
import { filterDiscography } from '@/lib/filterDiscography';
// import components
import Card from '../cards/card';
import DiscographyViewButtons from './discographyViewButtons';

/**
 * Renders partial artist discography list on artist page
 * @function ArtistDiscography
 * @param {string} artistId
 * @returns {JSX}
 */
function ArtistDiscography({ artistId }) {
  const router = useRouter();
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const numOfItems = useNumOfItems();
  const [lastArtistId, setLastArtistId] = useRecoilState(lastArtistIdState); // last artists loaded Id
  const [allDiscography, setAllDiscography] = useRecoilState(
    artistsDiscographyState
  );
  const [singlesOnly, setSinglesOnly] = useRecoilState(singlesDiscographyState);
  const [albumsOnly, setAlbumsOnly] = useRecoilState(albumsDiscographyState);
  const discographyToShow = useRecoilValue(discographyToShowState);

  useEffect(() => {
    // avoid artist discography being refetched when user returns to same artists page (after browsing discography for example)
    if (lastArtistId !== artistId) {
      if (spotifyApi.getAccessToken()) {
        spotifyApi.getArtistAlbums(artistId, { limit: 14 }).then(
          function (data) {
            setAllDiscography(data.body?.items);

            setSinglesOnly(filterDiscography(data.body?.items, 'single'));

            setAlbumsOnly(filterDiscography(data.body?.items, 'album'));
            setLastArtistId(artistId);
          },
          function (err) {
            console.error(err);
          }
        );
      }
    }
  }, [
    spotifyApi,
    session,
    lastArtistId,
    artistId,
    setSinglesOnly,
    setAlbumsOnly,
    setLastArtistId,
    setAllDiscography,
  ]);

  // show  all, albums or singles
  const listToUse =
    discographyToShow == 'album'
      ? albumsOnly
      : discographyToShow === 'single'
      ? singlesOnly
      : allDiscography;


  const handleDiscography = () => {
    router.push(`/artist/discography/${artistId}`);
  };

  return (
    <div className=" py-4 px-5 xs:px-8">
      {allDiscography?.length === 0 ? (
        <section>
          <h2 className="text-white mt-4 mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
            Discography
          </h2>
          <div className="p-4 rounded-lg bg-gray-900 h-60 flex justify-center items-center">
            <h3 className="text-white">Sorry no Discography</h3>
          </div>
        </section>
      ) : (
        <section className="mb-9">
          {/*  partial (7) artists discography list */}
          <div className="flex items-center justify-between">
            <h2 className="text-white mb-5 text-2xl md:text-3xl 2xl:text-4xl flex-1">
              Discography
            </h2>
            <button
              className="mb-5 text-sm md:text-xl text-white hover:text-green-500"
              onClick={() => {
                handleDiscography();
              }}
            >
              <span>show all</span>
            </button>
          </div>
          <DiscographyViewButtons />
          <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {listToUse?.slice(0, numOfItems).map((item, i) => (
              <Card key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ArtistDiscography;

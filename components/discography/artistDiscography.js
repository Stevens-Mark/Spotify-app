import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
import useNumOfItems from '@/hooks/useNumberOfItems'; //control number of cards shown depending on screen width
// import state management recoil
import { useRecoilState } from 'recoil';
import { artistsDiscographyShortState } from '@/atoms/artistAtom';
import Card from '../cards/card';
import { mockAlbumData } from '@/public/mockData/mockAlbums';

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
  const [discography, setDiscography] = useRecoilState(
    artistsDiscographyShortState
  );

  // fetch just the first 7 albums to display on artist page
  useEffect(() => {
    // setDiscography(mockAlbumData);
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getArtistAlbums(artistId, { limit: 7 }).then(
        function (data) {
          setDiscography(data.body?.items);
        },
        function (err) {
          console.error(err);
        }
      );
    }
  }, [spotifyApi, session, setDiscography, artistId]);

  // useEffect(() => {
  //   if (spotifyApi.getAccessToken()) {
  //     spotifyApi.getNewReleases( { limit : 50, country: 'GB' })
  //     .then(function(data) {

  //       console.log('new releases', data.body);
  //       const filteredAlbums = data.body.albums.items.filter(album => {
  //         return album.artists.some(artist => artist.id === artistId);
  //       });
  //       console.log('filtered releases',filteredAlbums)
  //       }, function(err) {
  //          console.log("Something went wrong!", err);
  //       });

  //   }
  // }, [spotifyApi, session, artistId]);

  //   useEffect(() => {
  //   if (spotifyApi.getAccessToken()) {
  //     spotifyApi.getFeaturedPlaylists({ limit : 50, country: 'GB', locale: 'en_GB',})
  //     .then(function(data) {
  //       console.log(data.body);
  //       console.log('FeaturedPlaylists ', data.body);
  //     }, function(err) {
  //       console.log("Something went wrong!", err);
  //     });

  //   }
  // }, [spotifyApi]);

  //     useEffect(() => {
  //   if (spotifyApi.getAccessToken()) {
  //     spotifyApi.getRecommendations({
  //       min_energy: 0.4,
  //       seed_artists: [artistId],
  //       min_popularity: 50
  //     })
  //   .then(function(data) {
  //     let recommendations = data.body;
  //     console.log("recommend ",recommendations);
  //   }, function(err) {
  //     console.log("Something went wrong!", err);
  //   });

  //   }
  // }, [spotifyApi, session, artistId]);

  const handleDiscography = () => {
    router.push(`/artist/discography/${artistId}`);
  };

  return (
    <div className=" py-4 px-5 xs:px-8">
      {discography?.length === 0 ? (
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
          <div className="grid grid-cols-1 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {discography?.slice(0, numOfItems).map((item, i) => (
              <Card key={`${item.id}-${i}`} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ArtistDiscography;

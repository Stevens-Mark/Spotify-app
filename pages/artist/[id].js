import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
// import state management recoil
import { useSetRecoilState } from 'recoil';
import { artistTrackListState, artistTrackUrisState } from '@/atoms/artistAtom';
// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { msToTime } from '@/lib/time';
import { totalArtistTrackDuration } from '@/lib/totalTrackDuration';
import { capitalize } from '@/lib/capitalize';
// import icon/images
import Image from 'next/image';
import noArtist from '@/public/images/noImageAvailable.svg';
import { colors } from '@/styles/colors';
// import components
import Layout from '@/components/layouts/Layout';
import ArtistTracks from '@/components/trackListArtist/artistTracks';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  const fetchArtistInfo = async (id) => {
    try {
      const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Artist information:', err);
      return null;
    }
  };

  const fetchArtistTracks = async (id) => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/artists/${id}/top-tracks?country=${countries.join(
          '&'
        )}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Artist tracks:', err);
      return null;
    }
  };

  const countries = ['US', 'FR'];
  const artistTracks = await fetchArtistTracks(id, countries);
  const artistInfo = await fetchArtistInfo(id);

  return {
    props: {
      // session,
      artistInfo,
      artistTracks,
    },
  };
}

/**
 * Renders Artist page with tracks
 * @function ArtistPage
 * @param {object} artistInfo information about the artist
 *  * @param {object} artistTracks top 10 tracks
 * @returns {JSX}
 */
const ArtistPage = ({ artistInfo, artistTracks }) => {
  const setArtistTracklist = useSetRecoilState(artistTrackListState);
  const setArtistTrackUris = useSetRecoilState(artistTrackUrisState);
  const [randomColor, setRandomColor] = useState(null);

  useEffect(() => {
    setRandomColor(shuffle(colors).pop());
    setArtistTracklist(artistTracks);
    setArtistTrackUris(artistTracks?.tracks.map((track) => track.uri)); // set uris to be used in player
  }, [artistTracks, setArtistTrackUris, setArtistTracklist]);

  return (
    <>
      <Head>
        <title>Artists</title>
      </Head>
      <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        <div
          className={`flex flex-col justify-end xs:flex-row xs:justify-start xs:items-end space-x-0 xs:space-x-7 bg-gradient-to-b to-black ${randomColor} h-80 text-white py-4 px-5 xs:p-8`}
        >
          <Image
            className="h-16 w-16 xs:h-44 xs:w-44 shadow-2xl ml-0 xs:ml-7"
            src={artistInfo?.images?.[0]?.url || noArtist}
            alt=""
            width={100}
            height={100}
            priority
          />
          <div>
            {artistInfo && (
              <>
                <p className="pt-2">{capitalize(artistInfo?.type)}</p>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold pt-1 pb-[7px] line-clamp-1">
                  {artistInfo?.name}
                </h1>
                {/* <p className="text-sm mt-5 mb-2 line-clamp-2">
                  {artistInfo?.description}
                </p> */}
                <span>
                  {(artistInfo?.followers?.total).toLocaleString()}{' '}
                  followers&nbsp;•&nbsp;
                </span>
                <span className="text-sm">
                  {artistTracks?.tracks?.length}{' '}
                  {artistTracks?.tracks?.length > 1 ? 'songs' : 'song'},{' '}
                </span>
                <span className="text-sm truncate text-pink-swan">
                  {msToTime(totalArtistTrackDuration(artistTracks))}
                </span>
              </>
            )}
          </div>
        </div>
        <section className="pb-20">
          <h2 className="sr-only">Track List</h2>
          <ArtistTracks />
        </section>
      </div>
    </>
  );
};

export default ArtistPage;

ArtistPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

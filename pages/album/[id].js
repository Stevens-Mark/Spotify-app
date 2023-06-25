import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
// import state management recoil
import { useSetRecoilState } from 'recoil';
import { albumIdState, albumTrackListState } from '@/atoms/albumAtom';
// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { msToTime } from '@/lib/time';
import { totalAlbumDuration } from '@/lib/totalTrackDuration';
import { capitalize } from '@/lib/capitalize';
import { analyseImageColor } from '@/lib/analyseImageColor.js';
// import icon/images
import Image from 'next/image';
import noAlbum from '@/public/images/noImageAvailable.svg';
import { colors } from '@/styles/colors';
// import components
import Layout from '@/components/layouts/Layout';
import AlbumTracks from '@/components/trackListAlbum/albumTracks';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  const fetchAlbum = async (id) => {
    try {
      const res = await fetch(` https://api.spotify.com/v1/albums/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Album tracks:', err);
      return null;
    }
  };

  const album = await fetchAlbum(id);

  return {
    props: {
      album,
    },
  };
}

/**
 * Renders Album page with tracks
 * @function AlbumPage
 * @param {object} album
 * @returns {JSX}
 */
const AlbumPage = ({ album }) => {
  const setCurrentAlbumId = useSetRecoilState(albumIdState);
  const setAlbumTracklist = useSetRecoilState(albumTrackListState);
  const [randomColor, setRandomColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState();

  useEffect(() => {
    setCurrentAlbumId(album?.id);
    setAlbumTracklist(album);
  }, [album, setAlbumTracklist, setCurrentAlbumId]);

  // analyse image colors for custom background & set default random background color (in case)
  useEffect(() => {
    setRandomColor(shuffle(colors).pop()); // default color tailwind (in case)
    const imageUrl = album?.images?.[0]?.url;
    if (imageUrl) {
      // custom background color (css style)
      analyseImageColor(imageUrl).then((dominantColor) => {
        setBackgroundColor(dominantColor);
      });
    } else {
      setBackgroundColor(null);
    }
  }, [album?.images]);

  return (
    <>
      <Head>
        <title>Spotify - Albums</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
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
            src={album?.images?.[0]?.url || noAlbum}
            alt=""
            width={100}
            height={100}
            priority
          />
          <div>
            {album && (
              <div className="drop-shadow-text">
                <span className="pt-2">{capitalize(album?.album_type)}</span>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold pt-1 pb-[7px] line-clamp-1">
                  {album?.name}
                </h1>
                <p className=" text-sm mt-5 mb-2 line-clamp-2 text-pink-swan">
                  {album?.description}
                </p>
                <span>{album?.artists?.[0]?.name}&nbsp;•&nbsp;</span>
                <span>{album?.release_date.slice(0, 4)}&nbsp;•&nbsp;</span>
                <span className="text-sm">
                  {album?.tracks.items.length}{' '}
                  {album?.tracks.items.length > 1 ? 'songs' : 'song'},{' '}
                </span>
                <span className="text-sm truncate text-pink-swan">
                  {msToTime(totalAlbumDuration(album))}
                </span>
              </div>
            )}
          </div>
        </div>
        <section className="pb-20">
          <h2 className="sr-only">Track List</h2>
          <AlbumTracks />
        </section>
      </div>
    </>
  );
};

export default AlbumPage;

AlbumPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

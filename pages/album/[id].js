import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { msToTime } from '@/lib/time';
import { totalAlbumDuration } from '@/lib/totalTrackDuration';
import { capitalize } from '@/lib/capitalize';
// import icon/images
import Image from 'next/image';
import noAlbum from '@/public/images/noImageAvailable.svg';
import { colors } from '@/styles/colors';
import Layout from '@/components/layouts/Layout';

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
      // session,
      album,
    },
  };
}

const AlbumPage = ({ album }) => {
  const mediaList = album;

  console.log('mediaList ', mediaList);
  const [randomColor, setRandomColor] = useState(null);

  useEffect(() => {
    // setRandomColor(colors[Math.floor(Math.random() * 7)]);
    setRandomColor(shuffle(colors).pop());
  }, []);

  return (
    <>
      <Head>
        <title>Albums</title>
      </Head>
      <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
        <div
          className={`flex flex-col justify-end sm:flex-row sm:justify-start sm:items-end space-x-7 bg-gradient-to-b to-black ${randomColor} h-80 text-white p-8`}
        >
          <Image
            className="h-16 w-16 sm:h-44 sm:w-44 shadow-2xl ml-7"
            src={mediaList?.images?.[0]?.url || noAlbum}
            alt=""
            width={100}
            height={100}
            priority
          />
          <div>
            {mediaList && (
              <>
                <p className="pt-2">{capitalize(mediaList?.album_type)}</p>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold pb-5 pt-1 truncate">
                  {mediaList?.name}
                </h1>
                <p className=" text-sm pb-2">{mediaList?.description}</p>
                <span>{mediaList?.artists?.[0]?.name}&nbsp;•&nbsp;</span>
                <span>{mediaList?.release_date.slice(0, 4)}&nbsp;•&nbsp;</span>
                <span className="text-sm">
                  {mediaList?.tracks.items.length}{' '}
                  {mediaList?.tracks.items.length > 1 ? 'songs' : 'song'},{' '}
                </span>
                <span className="text-sm truncate">
                  {msToTime(totalAlbumDuration(mediaList))}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AlbumPage;

AlbumPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

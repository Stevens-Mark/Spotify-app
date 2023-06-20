import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
// import state management recoil
import { useSetRecoilState, useRecoilState } from 'recoil';
import { showEpisodesUrisState, showEpisodesListState } from '@/atoms/showAtom';

// import functions
import { shuffle } from 'lodash'; // function used to select random color
import { capitalize } from '@/lib/capitalize';
import { fetchDominantColor } from '@/lib/dominantColor';
import { analyseImageColor } from '@/lib/analyseImageColor.js';
// import icon/images
import Image from 'next/image';
import noArtist from '@/public/images/noImageAvailable.svg';
import { colors } from '@/styles/colors';
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

  const fetchShowEpisodes = async (id) => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/shows/${id}/episodes`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Show Episodes:', err);
      return null;
    }
  };

  const showInfo = await fetchShowInfo(id);
  const showEpisodes = await fetchShowEpisodes(id);

  return {
    props: {
      // session,
      showInfo,
      showEpisodes,
    },
  };
}

/**
 * Renders Artist page with tracks
 * @function ShowPage
 * @param {object} showInfo information about the show
 * @param {object} showEpisodes top 10 tracks
 * @returns {JSX}
 */
const ShowPage = ({ showInfo }) => {

  // const setShowEpisodesList = useSetRecoilState(showEpisodesListState);
  const [showEpisodesList, setShowEpisodesList] = useRecoilState(
    showEpisodesListState
  );
  // const setShowEpisodesUris = useSetRecoilState(showEpisodesUrisState);
  const [showEpisodesUris, setShowEpisodesUris] = useRecoilState(
    showEpisodesUrisState
  );
  const [randomColor, setRandomColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState();

  useEffect(() => {
    setShowEpisodesList(showInfo.episodes.items);
    setShowEpisodesUris(showInfo.episodes.items.map((track) => track.uri)); // set uris to be used in player
  }, [setShowEpisodesList, setShowEpisodesUris, showInfo.episodes.items]);

  // analyse image colors for custom background
  useEffect(() => {
    setRandomColor(shuffle(colors).pop()); // set default color tailwind (in case)
    const imageUrl = showInfo?.images?.[0]?.url;
    if (imageUrl) {
      // custom background color (css style)
      fetchDominantColor(imageUrl).then((dominantColor) => {
        setBackgroundColor(dominantColor);
      });
    } else {
      setBackgroundColor(null);
    }
  }, [showInfo?.images]);

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

  return (
    <>
      <Head>
        <title>Shows</title>
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
          <ShowTracks />
        </section>
      </div>
    </>
  );
};

export default ShowPage;

ShowPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

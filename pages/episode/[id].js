import Head from 'next/head';
import { getSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
//import functions
import TrackProgressBar from '@/components/graphics/TrackProgressBar';
import { getMonthYear, msToTime } from '@/lib/time';
// import components
import Layout from '@/components/layouts/Layout';
import MediaHeading from '@/components/headerLabels/MediaHero';
import QuickPlayBanner from '@/components/player/QuickPlayBanner';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  const fetchEpisode = async (id) => {
    try {
      const res = await fetch(`https://api.spotify.com/v1/episodes/${id}`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving Episode:', err);
      return null;
    }
  };

  const episode = await fetchEpisode(id);

  return {
    props: {
      episode,
    },
  };
}

/**
 * Renders an Episode
 * @function EpisodePage
 * @param {object} episode
 * @returns {JSX}
 */
const EpisodePage = ({ episode }) => {
  const textRef = useRef(null);
  const scrollRef = useRef(null);

  const [expandABoutText, setExpandABoutText] = useState(false); // show expand/collapse About text
  const [expandABoutButton, setExpandABoutButton] = useState(false); // show/hide see more/less button

  // calculate if About text is more than 4 lines high ?
  // if not, hide see more button as not needed
  useEffect(() => {
    const textElement = textRef.current;
    if (textElement) {
      const lineCount =
        textElement.clientHeight /
        parseInt(getComputedStyle(textElement).lineHeight);
      setExpandABoutButton(lineCount < 4 ? false : true);
    }
  }, []);

  // show expand/collapse Description text
  const expandABoutTextToggle = () => {
    setExpandABoutText((prevState) => !prevState);
  };

  return (
    <>
      <Head>
        <title>Spotify - Episode</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div
        className="flex-grow h-screen overflow-y-scroll scrollbar-hide"
        ref={scrollRef}
      >
        {/* Hero bar with image, album title & author etc */}
        <MediaHeading item={episode} />

        <aside className="flex items-center text-pink-swan ml-5 xs:ml-83">
          <span className="line-clamp-1">
            {getMonthYear(episode?.release_date)}&nbsp;•&nbsp;
          </span>
          <span className="line-clamp-1">
            {msToTime(
              episode?.duration_ms - episode?.resume_point?.resume_position_ms
            )}
            {episode?.resume_point?.fully_played ? '' : ' left'}
          </span>

          <TrackProgressBar
            resumePosition={episode?.resume_point?.resume_position_ms}
            duration={episode?.duration_ms}
          />
        </aside>

        {/* <QuickPlayBanner item={episode} scrollRef={scrollRef} /> */}

        <section className="p-5 xs:px-8 max-w-4xl mb-14">
          <h2 className="text-white text-xl md:text-2xl xl:text-3xl mb-5">
            Episode Desciption
          </h2>

          {/* if there is a html description use it: links open in seperate page to avoid hydration issues */}
          {episode?.html_description ? (
            <p
              ref={textRef}
              className={`text-pink-swan links ${
                !expandABoutText ? 'line-clamp-4' : ''
              }`}
              dangerouslySetInnerHTML={{
                __html: episode?.html_description.replace(
                  /<a(.*?)>/gi,
                  '<a$1 target="_blank" rel="noopener noreferrer">'
                ),
              }}
            />
          ) : (
            <p
              ref={textRef}
              className={`text-pink-swan links ${
                !expandABoutText ? 'line-clamp-4' : ''
              }`}
            >
              {episode?.description}
            </p>
          )}

          {expandABoutButton && (
            <button
              className="mt-3 text-sm md:text-lg text-white hover:text-green-500"
              onClick={expandABoutTextToggle}
            >
              {!expandABoutText ? '... See more' : 'See less'}
            </button>
          )}
        </section>
        <Link
          className="text-white border rounded-full py-1 px-3 mx-5 xs:mx-8  hover:text-green-500 hover:border-green-500"
          href={`/show/${episode?.show?.id}`}
        >
          see all episodes
        </Link>
      </div>
    </>
  );
};

export default EpisodePage;

EpisodePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
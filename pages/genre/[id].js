import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// custom hooks
import useScrollToTop from '@/hooks/useScrollToTop';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
// import state management recoil
import { useRecoilState } from 'recoil';
import { genreListState } from '@/atoms/genreAtom';
// import layouts/components
import Layout from '@/components/layouts/Layout';
import MediaResultList from '@/components/lists/mediaResultList';

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  const fetchGenrelist = async (id) => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/browse/categories/${id}/playlists`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error retrieving genre information: ', err);
      return null;
    }
  };

  const genreData = await fetchGenrelist(id);

  const fetchCategory = async () => {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/browse/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      const categoryData = await res.json();
      genreData.categoryName =
        categoryData?.name || 'Sorry no information found....';
    } catch (err) {
      console.error('Error retrieving category name:', err);
      genreData.categoryName = '';
    }
  };

  await fetchCategory();

  return {
    props: {
      genreData,
    },
  };
}

/**
 * Renders the choosen genre category playlists
 * @function Genres
 * @param {object} genreData heading & genre playlists data
 * @returns {JSX}
 */
function Genres({ genreData }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { scrollableSectionRef, showButton, scrollToTop } = useScrollToTop(); // scroll button

  const [genreList, setGenreList] = useRecoilState(genreListState);
  const [id, setId] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [stopFetch, setStopFetch] = useState(false);

  const totalNumber = genreData?.playlists?.total;
  const genreCategory = genreData?.categoryName;
  const error = genreData?.error || null;

  useEffect(() => {
    setGenreList(genreData?.playlists?.items);
  }, [genreData?.playlists?.items, setGenreList]);

  
  useEffect(() => {
    setId((router?.asPath).split('/').pop());
  }, [router?.asPath, setId]);

  // show message when all data loaded/end of infinite scrolling
  useEffect(() => {
    if (stopFetch) {
      toast.info("That's everything !", {
        theme: 'colored',
      });
    }
  }, [stopFetch]);

  /**
   * Fetches more genre playlists & update the current list
   * @function fetchMoreData
   * @returns {object} updated genre playlist
   */
  const fetchMoreData = async () => {
    if (genreList && !stopFetch) {
      const itemsPerPage = 30;
      const nextOffset = currentOffset + itemsPerPage;
      try {
        const res = await fetch(
          `https://api.spotify.com/v1/browse/categories/${id}/playlists?offset=${nextOffset}&limit=${itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );
        const data = await res.json();
        setStopFetch(data?.playlists?.next === null);
        // Update genreList state
        setGenreList([...genreList, ...data.playlists.items]);
        setCurrentOffset(nextOffset);
      } catch (err) {
        console.error('Retrieving more items failed ...');
        toast.error('Retrieving more items failed !', {
          theme: 'colored',
        });
        return null;
      }
    }
  };
  const containerRef = useInfiniteScroll(fetchMoreData);

  return (
    <>
      <Head>
        <title>Spotify - Results for Playlists</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>

      <MediaResultList
        heading={genreCategory}
        error={error}
        mediaList={genreList}
        totalNumber={totalNumber}
        showButton={showButton}
        scrollToTop={scrollToTop}
        scrollableSectionRef={scrollableSectionRef}
        containerRef={containerRef}
      />
    </>
  );
}

export default Genres;

Genres.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

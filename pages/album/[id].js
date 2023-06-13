import Head from 'next/head';
import { getSession } from 'next-auth/react';
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
      return (data);
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

  return (
    <>
      <Head>
        <title>Albums</title>
      </Head>

      <div>
        <h1 className="text-white">Parameter: {album?.id}</h1>
      </div>
    </>
  );
};

export default AlbumPage;

AlbumPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

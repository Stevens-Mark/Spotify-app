import Head from 'next/head';
// import React, { useEffect } from 'react';
// import useSpotify from '@/hooks/useSpotify';
// import { useRouter } from 'next/router';
// // import components
import Layout from '@/components/layouts/Layout';

// const AlbumPage = () => {
//   const spotifyApi = useSpotify();
//   const router = useRouter();
//   const { id } = router.query;

//   useEffect(() => {
//     if (spotifyApi.getAccessToken()) {
//       const fetchAlbum = async () => {
//         try {
//           const response = await spotifyApi.getAlbum(id);
//           const album = response.body;
//           console.log(album);
//         } catch (err) {
//           console.error('Error retrieving Album track:');
//         }
//       };
//       fetchAlbum();
//     }
//   }, [id, spotifyApi]);

//   return (
//   <>
//     <Head>
//       <title>Albums</title>
//     </Head>

//     <div>
//       <h1 className='text-white'>Parameter: {id}</h1>
//     </div>
//   </>
// );
// };

// export default AlbumPage;

import { getSession } from 'next-auth/react';
import spotifyApi from '@/lib/spotify';
import { useRouter } from 'next/router';

// Utility function to fetch album data
async function fetchAlbumData(id) {
  if (spotifyApi.getAccessToken()) {
    const response = await spotifyApi.getAlbum(id);
    console.log('response ', response);
    return response.body;
  }
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);

  // Fetch album data using the utility function
  let album = null;

  try {
    album = await fetchAlbumData(id);
  } catch (err) {
    console.error('Error retrieving Album track:', err);
  }

  return {
    props: {
      album,
    },
  };
}

const AlbumPage = ({ album }) => {
  const router = useRouter();
  const { id } = router.query;
  console.log(album);
  return (
    <>
      <Head>
        <title>Albums</title>
      </Head>

      <div>
        <h1 className="text-white">Parameter: {id}</h1>
      </div>
    </>
  );
};

export default AlbumPage;

AlbumPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

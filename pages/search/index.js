import React from 'react';
import { getSession } from 'next-auth/react';
// import icons & components
import Layout from '@/components/layouts/Layout';
import NestedLayout from '@/components/layouts/NestedLayout';
import Genre from '@/components/Genre';

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   return {
//     props: {
//       session,
//     },
//   };
// }

/**
 * Renders search page
 * @function Search
 * @returns {JSX}
 */
function Search() {
  return (
    <>
      <h1 className="sr-only">Search Page</h1>
      <Genre />
      );
    </>
  );
}

export default Search;

Search.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

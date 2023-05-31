import React from 'react';
// import icons & components
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import Genre from '@/components/Genre';

/**
 * Renders search page
 * @function Search
 * @returns {JSX}
 */
function Search() {
  return (
    <>
    <h1 className='sr-only'>Search Page</h1>
  <Genre />);
  </>)
}

export default Search;

Search.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

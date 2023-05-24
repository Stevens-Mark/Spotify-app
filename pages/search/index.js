import React from 'react';
// import icons & components
import Layout from '@/components/Layout';
import NestedLayout from '@/components/NestLayout';
import Genre from '@/components/Genre';

function Search() {
  return <Genre />;
}

export default Search;

Search.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

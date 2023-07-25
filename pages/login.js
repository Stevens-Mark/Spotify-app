import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import Logo from '@/components/logo';

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}

/**
 * Renders login page
 * @function Login
 * @param {object} providers spotify provider information.
 * @returns {JSX}
 */
function Login({ providers }) {
  // if getServerSideProps does not work then use below instead
  // const [providers, setProviders] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     const res = await getProviders();
  //     setProviders(res);
  //   })();
  // }, []);

  return (
    <>
      <Head>
        <title>Provided by Spotify - Login</title>
        <link rel="icon" href="/spotify.ico"></link>
      </Head>
      <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
        <Logo />
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="bg-[#18D860] text-white p-3 rounded-full"
                onClick={() => signIn(provider.id, { callbackUrl: '/' })}
              >
                Login with {provider.name}
              </button>
            </div>
          ))}
      </div>
    </>
  );
}

export default Login;

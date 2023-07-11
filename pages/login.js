import React, { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import Image from 'next/image';

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
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <Image
        className="w-52 mb-5"
        src="/images/Spotify_logo.svg"
        alt=""
        width={52}
        height={52}
        priority
      />

      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="bg-[#18D860] text-white p-5 rounded-full"
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            >
              Login with {provider.name}
            </button>
          </div>
        ))}
    </div>
  );
}

export default Login;

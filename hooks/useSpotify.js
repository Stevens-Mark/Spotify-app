import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import spotifyApi from '@/lib/spotify';

/**
 * Custom hook for user authentication/set access token/session
 * @function useSpotify
 * @returns {object} spotifyApi
 */
function useSpotify() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // If refresh access token attempt failed, direct user to login ...
      if (session.error === 'RefreshAccessTokenError') {
        signIn();
      }
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyApi;
}

export default useSpotify;

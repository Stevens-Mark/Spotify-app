import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '@/lib/spotify';

const refreshAccessToken = async (token) => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      expires_at: Date.now + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify API
      refreshedToken: refreshedToken.refresh_token ?? token.refreshToken, // Replace if new one came back else fall back to old refresh token
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorizaton: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          expires_at: account.expires_at * 1000, // we are handling expiry times in milliseconds hence * 1000
        };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < token.expires_at) {
        console.log('EXISTING TOKEN IS VALID');
        return token;
      }
      // Access token has expired, so need to refresh it ...
      console.log('EXISTING TOKEN EXPIRED, REFRESHING ....');
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;
      }
      return session;
    },
  },
});

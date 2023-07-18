// import { Html, Head, Main, NextScript } from 'next/document'

// export default function Document() {
//   return (
//     <Html lang="en">
//       <Head />
//       <body>
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }

import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add your metadata tags here */}
          <meta
            name="description"
            content="Spotify Clone - A Spotify clone by Mark Stevens. A project to make a simple Spotify clone using the Spotify web api which enables the creation of applications that can interact with Spotify's streaming service, such as retrieving content metadata, getting recommendations, creating and managing playlists, or controlling playback."
          />
          <meta name="google-site-verification" content="0jMzjXem8gLJYuM13PgdI2qiZtQljTKPzBpnDCC0KLg" />
          <meta name="author" content="Mark Stevens - Frontend Developer" />

          <meta property="og:title" content="Spotify clone - A simple Spotify app by Mark Stevens" />
          <meta
            name="image"
            property="og:image"
            content="%PUBLIC_URL%/spotifyScreenshot.png"
          />

          <meta property="og:description" content="Spotify clone - A simple Spotify app by Mark Stevens" />
          <meta property="og:url" content="none yet" />

          <link rel="apple-touch-icon" href="%PUBLIC_URL%/spotify192.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import '@/styles/globals.css';

// export default function App({
//   Component,
//   pageProps: { session, ...pageProps },
// }) {
//   return (
//     <SessionProvider session={session}>
//       <RecoilRoot>
//         <Component {...pageProps} />
//       </RecoilRoot>
//     </SessionProvider>
//   );
// }


// export default function MyApp({ Component, pageProps }) {
//   // Use the layout defined at the page level, if available
//   const getLayout = Component.getLayout || ((page) => page);

//   return getLayout(<Component {...pageProps} />);
// }

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        {/* <Component {...pageProps} /> */}
       { getLayout(<Component {...pageProps} />)}
      </RecoilRoot>
    </SessionProvider>
  );
}

import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <ToastContainer
          position="bottom-right"
          transition={Bounce}
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          // limit={3}
          style={{ fontSize: '18px', textAlign: 'center', bottom: '5rem' }}
        />
        {getLayout(<Component {...pageProps} />)}
      </RecoilRoot>
    </SessionProvider>
  );
}

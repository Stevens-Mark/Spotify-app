import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import Layout from '@/components/Layout'
import '@/styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </SessionProvider>
  )
}



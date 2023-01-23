import React from 'react';
import '../styles/globals.css';
import '../styles/artistPage.css';
import { AuthContextProvider } from '../context/AuthContext';
import Navbar from '../components/navbar';
import Head from 'next/head';
import localFont from '@next/font/local';

const firanerd = localFont({
  src: './../assets/FuraMonoRegularNerdFontCompleteMono.otf',
  variable: '--firanerd',
});

type AppProps = {
  Component: React.ComponentType;
  pageProps: any;
};
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`antialiased text-black bg-white dark:bg-neutral-900 dark:text-white ${firanerd.variable}`}>
      <Head>
        <title>Voxlog</title>
        <meta name="description" content="Voxlog" />
        <link rel="icon" href="/images/logo-black.svg" />
      </Head>
      <AuthContextProvider>
        <Navbar />
        <Component {...pageProps} />
      </AuthContextProvider>
    </div>
  );
}

export default MyApp;

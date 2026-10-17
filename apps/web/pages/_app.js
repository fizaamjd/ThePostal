import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../createEmotionCache';
import { AuthProvider } from '../lib/auth-context';
import { ThemeModeProvider } from '../lib/theme-mode';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Postal — SMTP server & delivery telemetry</title>
        <meta
          name="description"
          content="A self-hosted SMTP mail transfer agent with per-transaction network telemetry."
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      {/* Theme mode wraps auth so a signed-out page is themed too. */}
      <ThemeModeProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeModeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/theme.css';

const FRAME_URL = 'https://talent-barter.vercel.app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Talent Barter - Find Web3 Builders</title>
        <meta name="description" content="Discover and connect with top Web3 builders on Farcaster" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        
        {/* Farcaster Frame Embed Meta Tags */}
        <meta name="fc:frame" content='{"version":"next","imageUrl":"https://talent-barter.vercel.app/og-image.svg","button":{"title":"Find Talent","action":{"type":"launch_frame","name":"Talent Barter","url":"https://talent-barter.vercel.app","splashImageUrl":"https://talent-barter.vercel.app/splash.svg","splashBackgroundColor":"#8B5CF6"}}}' />
        
        {/* Open Graph */}
        <meta property="og:title" content="Talent Barter - Find Web3 Builders" />
        <meta property="og:description" content="Discover and connect with top Web3 builders. Pay once with cUSD for lifetime access." />
        <meta property="og:image" content={`${FRAME_URL}/og-image.svg`} />
        <meta property="og:url" content={FRAME_URL} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Talent Barter - Find Web3 Builders" />
        <meta name="twitter:description" content="Discover and connect with top Web3 builders on Farcaster" />
        <meta name="twitter:image" content={`${FRAME_URL}/og-image.svg`} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

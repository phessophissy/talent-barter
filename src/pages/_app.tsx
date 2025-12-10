import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/theme.css';

const FRAME_URL = 'https://talent-barter-3ax4mh4b6-phessophissys-projects.vercel.app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Talent Barter - Find Web3 Builders</title>
        <meta name="description" content="Discover and connect with top Web3 builders on Farcaster" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        
        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={`${FRAME_URL}/og-image.png`} />
        <meta property="fc:frame:button:1" content="Find Talent" />
        <meta property="fc:frame:button:1:action" content="launch_frame" />
        <meta property="fc:frame:button:1:target" content={FRAME_URL} />
        
        {/* Open Graph */}
        <meta property="og:title" content="Talent Barter - Find Web3 Builders" />
        <meta property="og:description" content="Discover and connect with top Web3 builders. Pay once with cUSD for lifetime access." />
        <meta property="og:image" content={`${FRAME_URL}/og-image.png`} />
        <meta property="og:url" content={FRAME_URL} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Talent Barter - Find Web3 Builders" />
        <meta name="twitter:description" content="Discover and connect with top Web3 builders on Farcaster" />
        <meta name="twitter:image" content={`${FRAME_URL}/og-image.png`} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

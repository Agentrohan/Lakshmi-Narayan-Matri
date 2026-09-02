import { Helmet } from '@dr.pogodin/react-helmet';
import { type ReactElement } from 'react';
import { ScrollRestoration } from "react-router";
import Footer from '@/layouts/parts/Footer';
import Header from '@/layouts/parts/Header';
import Website from '@/layouts/Website';

/**
 * Root layout component that wraps all pages with consistent header and footer.
 *
 * To customize the header or footer, directly edit the Header.tsx and Footer.tsx
 * files in the layouts/parts directory.
 *
 * Site-wide <title> and <meta> live in the <Helmet> below. Individual pages can
 * override them by rendering their own <Helmet> — last-mounted wins.
 */
interface RootLayoutProps {
  children: ReactElement;
}
export default function RootLayout({
  children
}: RootLayoutProps) {
  return <Website>
      <Helmet>
        {/* Site-wide defaults — individual pages override these */}
        <html lang="en" />
        <title>Lakshmi Narayan Matrimony</title>
        <meta name="description" content="Lakshmi Narayan Matrimony offers private, hand-picked matchmaking with astrological compatibility and personalised support for families." />
        <meta name="keywords" content="Lakshmi Narayan Matrimony, लक्ष्मी नारायण वधू वर सूचक, private matchmaking, hand-picked matches, astrological compatibility" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Lakshmi Narayan Matrimony" />
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.country" content="IN" />
        <meta property="og:site_name" content="Lakshmi Narayan Matrimony" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:locale:alternate" content="mr_IN" />
      </Helmet>
      <ScrollRestoration />
      <Header />
      {children}
      <Footer />
    </Website>;
}

import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { StoreLayoutShell } from '../components/layout/StoreLayoutShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Rangoli Fashions | Premium Indian Ethnic Wear & Kurti Sets',
  description:
    'Discover thoughtfully crafted Indian ethnic fashion. Explore our exquisite collection of premium kurti sets, cotton co-ords, festive wear, and modern ethnic silhouettes.',
  keywords: 'Rangoli Fashions, Kurti Sets, Indian Ethnic Wear, Cotton Co-ord Sets, Festive Kurtis, Designer Indian Wear',
  openGraph: {
    title: 'Rangoli Fashions | Premium Indian Ethnic Wear',
    description: 'Style for Every Occasion. Discover elegant and comfortable styles for everyday and special moments.',
    url: 'https://rangolifashions.com',
    siteName: 'Rangoli Fashions',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <StoreLayoutShell>{children}</StoreLayoutShell>
      </body>
    </html>
  );
}

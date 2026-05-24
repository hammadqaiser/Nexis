import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { BRAND } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${BRAND.name}`,
    default: `${BRAND.name} | Premium Courier & Logistics Services Pakistan`,
  },
  description: 'NEXIS COURIERS Pvt. Ltd. is a premium logistics provider offering domestic, international, cash-on-delivery (COD) e-fulfillment, and freight shipping across Pakistan.',
  keywords: ['courier service', 'logistics', 'delivery', 'TCS Pakistan', 'Leopards Courier', 'DHL Pakistan', 'COD shipping', 'e-commerce shipping', 'Nexis Couriers', 'Nexis Enterprises'],
  authors: [{ name: 'NEXIS ENTERPRISES' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: `${BRAND.name} | Connecting Pakistan, Delivering Trust`,
    description: 'Fast, secure, and reliable overnight, economy, and Cash on Delivery (COD) courier services throughout Pakistan.',
    url: 'https://nexiscouriers.com',
    siteName: BRAND.name,
    locale: 'en_PK',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import { Providers } from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-theme="dark">
      <body>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}

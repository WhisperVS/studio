import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { PT_Sans, Space_Grotesk } from 'next/font/google';

const ptSans = PT_Sans({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });
const spaceGrotesk = Space_Grotesk({ weight: ['400', '700'], subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'G.A.I.M.',
  description: 'Group Administrators Items Manager',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  // Theme fix update
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ptSans.className} ${spaceGrotesk.className} font-body antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
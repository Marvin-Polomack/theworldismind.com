import './globals.css';
import type { Metadata } from 'next';
import Providers from "./providers";
import { ViewportProvider } from '@/providers/ViewportProvider';

export const metadata: Metadata = {
  title: 'The World Is Mind',
  description: 'Come and mind your world',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <ViewportProvider>
          <Providers>
            {children}
          </Providers>
        </ViewportProvider>
      </body>
    </html>
  );
}

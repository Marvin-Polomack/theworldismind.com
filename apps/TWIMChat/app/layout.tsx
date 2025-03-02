import './globals.css';
import type { Metadata } from 'next';
import Providers from "./providers";

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
      <head />
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}


import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider as NextThemesProvider } from '@/components/theme-provider';
import { AppThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'New RIDE',
  description: 'Your partner for optimizing your driving shifts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4B0082" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="New RIDE" />
      </head>
      <body className="font-body antialiased">
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
          <AppThemeProvider>
            {children}
            <Toaster />
          </AppThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}

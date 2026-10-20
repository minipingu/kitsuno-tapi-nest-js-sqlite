import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SakuraPetals from '@/components/SakuraPetals';
import appCss from '../styles.css?url';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: '🌸 Kitsuno - Japanese Learning Platform' },
      {
        name: 'description',
        content:
          'Master Hiragana, Katakana, Kanji, Particles, and build personalized flashcards with Kitsuno.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/images/favicon/favicon.ico' },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col relative overflow-x-hidden">
            <SakuraPetals />
            <Navbar />
            <main className="flex-1 relative z-10">
              <Outlet />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

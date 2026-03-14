import type { Metadata } from 'next';
import { Bebas_Neue, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';

const displayFont = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

const monoFont = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'MAXIMALER MUSKELAUFBAU',
  description: 'Minimalistischer Brutalismus Trainings-Tracker',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="antialiased">
      <body className={`${monoFont.className} ${displayFont.variable} ${monoFont.variable} fixed inset-0 flex flex-col bg-[var(--bg)] text-[var(--fg)] overflow-hidden`}>
        
        {/* Top Header Fixed */}
        <header className="border-b-[3px] border-brutal-border p-4 flex justify-between items-center bg-[var(--bg)] shrink-0 z-50">
          <div className="font-display text-4xl leading-none uppercase tracking-wider">
            Muskelaufbau
          </div>
        </header>

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full pb-20 p-4 md:p-6 pb-[calc(env(safe-area-inset-bottom)+80px)]">
          <div className="max-w-xl mx-auto w-full h-full pb-8">
            {children}
          </div>
        </main>
        
        {/* Fixed Bottom Navigation */}
        <BottomNav />
        
      </body>
    </html>
  );
}

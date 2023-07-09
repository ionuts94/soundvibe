import './globals.css'
import { Figtree } from 'next/font/google';

import { Sidebar } from '@/components/Sidebar';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { UserProvider } from '@/providers/UserProvider';
import { ModalProvider } from '@/providers/ModalProvider';
import { ToasterProvider } from '@/providers/ToasterProvider';
import { getSongsByUserId } from '@/actions/getSongsByUserId';

const font = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'Sound Vibes',
  description: 'Listen to music!',
}

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userSons = await getSongsByUserId();
  console.log(userSons)

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar
              userSongs={userSons}
            >
              {children}
            </Sidebar>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}

import './globals.css'
import { SessionProvider } from "next-auth/react"
import Navbar from './components/Navbar'

// app/layout.js
import { Providers } from "./providers";

export const metadata = {
  title: 'WXI',
  description: 'Connect, collaborate, and create impact together',
  icons: {
    icon: '/images/default-avatar.png',
    apple: '/images/default-avatar.png',
    shortcut: '/images/default-avatar.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
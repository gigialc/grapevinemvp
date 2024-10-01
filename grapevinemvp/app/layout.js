import './globals.css'
import Navbar from './components/Navbar'
import { SessionProvider } from "next-auth/react"
import { authConfig } from '../auth.config';

export const metadata = {
  title: 'Passion Project Network',
  description: 'Connect and collaborate on passion projects',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
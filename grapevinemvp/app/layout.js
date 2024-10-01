import './globals.css'
import { SessionProvider } from "next-auth/react"
import Navbar from './components/Navbar'

export const metadata = {
  title: 'Passion Project Network',
  description: 'Connect and collaborate on passion projects',
}

export default function RootLayout({ children }) {
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
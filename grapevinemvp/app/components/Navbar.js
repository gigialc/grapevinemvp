'use client'

import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"

const Navbar = () => {
  const { data: session, status } = useSession()

  return (
    <nav className="text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Grapevine 🍇
        </Link>
        <div>
          <Link href="/projects" className="mr-4 hover:text-purple-200">
            Discover
          </Link>
          {status === "authenticated" ? (
            <>
              <Link href="/profile" className="mr-4 hover:text-purple-200">
                Profile
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link 
              href="/login" 
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
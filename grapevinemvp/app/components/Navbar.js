'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'

const Navbar = () => {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex-1">
        <Link href="/explore" className="text-2xl font-bold">
          Grapevine 
        </Link>
      </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center">
          {/* <Link href="/projects" className="mr-4 hover:text-purple-200">
            Discover
          </Link> */}
          {status === "authenticated" ? (
            <>
             
              <Link href="/explore" className="mr-4 hover:text-purple-200">
                People🥂
              </Link>

              <Link href="/exploreProjects" className="block mr-4 py-2 hover:text-purple-200">
                Explore🤖
              </Link>
              {/* make this the grapevine image chat with grapevine */}
              {/* <Link href="/matches" className="hover:text-purple-200">
               
              </Link>
              <Link href="/matches">
              <Image 
                src="/images/default-avatar.png" 
                alt="Grapevine" 
                width={20} 
                height={20}
              />
            </Link> */}
             {/* make a profile avatar for this */}
             <Link href="/profile" className="ml-3 hover:text-purple-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            
              {/* <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className=" text-gray-600 font-bold py-2 px-4 rounded"
              >
                Sign out
              </button> */}
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-1 px-4 rounded mr-2"
              >
                Sign in
              </Link>
              <Link 
                href="/signup" 
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-1 px-4 rounded"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          {/* <Link href="/projects" className="block py-2 hover:text-purple-200">
            Discover
          </Link> */}
          {status === "authenticated" ? (
            <>
             
              <Link href="/explore" className="block py-2 hover:text-purple-200">
                People 🥂
              </Link>
              <Link href="/exploreProjects" className="block py-2 hover:text-purple-200">
                Explore🤖
              </Link>
              {/* <div className="flex items-center space-x-4">
                <Link href="/matches" className="flex items-center hover:text-purple-200">
                  <span className="mr-2">Networking</span>
                  <Image 
                    src="/images/default-avatar.png" 
                    alt="Grapevine" 
                    width={20} 
                    height={20}
                  />
                </Link>
                </div> */}
                <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center py-2 hover:text-purple-200">
              <span>Profile</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
              {/* <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block w-full text-left py-2 hover:text-purple-200 text-purple-600"
              >
                Sign out 
              </button> */}
              
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="block py-2 hover:text-purple-200"
              >
                Sign in
              </Link>
              <Link 
                href="/signup" 
                className="block py-2 hover:text-purple-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
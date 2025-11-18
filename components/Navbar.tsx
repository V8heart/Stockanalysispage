'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="font-bold text-xl">AlphaStock Insight</Link>
        <div className="space-x-5 text-sm">
          <Link className="hover:opacity-80" href="/">Home</Link>
          <Link className="hover:opacity-80" href="/analytics">Analytics</Link>
          <Link className="hover:opacity-80" href="/news">News</Link>
          <Link className="hover:opacity-80" href="/about">About</Link>
        </div>
      </div>
    </nav>
  )
}

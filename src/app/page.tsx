import Link from 'next/link';

export default function Home() {
    return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
      <h1>Bring It Bud!</h1>
      <p className="text-xl text-gray-600 mb-12"> 
        {/* Note: Added `&apos;` for apostrophe mark to avoid any ESLint warnings for TypeScript */}
        Organize who&apos;s bringing what to your next event. No signup required. 
      </p>
      <Link href="/create" className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg"
      >
        Create Event
      </Link>
      </div>
    </div>
    )
  }

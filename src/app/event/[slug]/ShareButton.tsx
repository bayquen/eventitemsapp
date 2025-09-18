'use client'    // Note: This runs in browser (client), not server
import { useState } from 'react'

interface ShareButtonProps {
  url: string
}

export default function ShareButton({ url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors"
    >
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  )
}
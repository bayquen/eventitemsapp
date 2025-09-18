// app/api/events/route.js
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// Generate random URL slug
function generateSlug() {
  const firstWords = ['happy', 'vibey', 'nonchalant', 'saucy', 'cool', 'fun', 'epic', 'super', 'fire', 'sweet']
  const secondWords = ['bear', 'cat', 'puppy', 'parrot', 'dog', 'sloth', 'python', 'owl', 'tiger', 'eagle']
  const random = Math.floor(Math.random() * 10000)
  const first = firstWords[Math.floor(Math.random() * firstWords.length)]
  const second = secondWords[Math.floor(Math.random() * secondWords.length)]
  return `${first}-${second}-${random}`
}

// Generate host edit code
function generateEditCode() {
  return Math.random().toString(36).substring(2, 15)
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Create the event with generated codes
    const eventData = {
      name: body.name,
      description: body.description || null,
      date: body.date || null,
      location: body.location || null,
      url_slug: generateSlug(),
      host_edit_code: generateEditCode()
    }
    
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
import { supabase } from '@/lib/supabase';          // For user-created Events database
import { NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';    // NanoID package is for production-grade unique string ID generation!

// Generate unique URL slug upon creation of an event
// function generateSlug() {
//   const firstWords = ['happy', 'vibey', 'nonchalant', 'saucy', 'cool', 'fun', 'epic', 'super', 'fire', 'sweet']
//   const secondWords = ['bear', 'cat', 'puppy', 'parrot', 'dog', 'sloth', 'python', 'owl', 'tiger', 'eagle']
//   const random = Math.floor(Math.random() * 10000)
//   const first = firstWords[Math.floor(Math.random() * firstWords.length)]
//   const second = secondWords[Math.floor(Math.random() * secondWords.length)]
//   return `${first}-${second}-${random}`
// }

// Generate host edit code
// function generateEditCode() {
//   return Math.random().toString(36).substring(2, 15)
// }

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12);   // custom alphanumeric URL generation, 2nd param is char length of slug URL
// Make lists of fun words to use for slug URL generation
const firstWords = ['happy', 'vibey', 'nonchalant', 'saucy', 'cool', 'fun', 'epic', 'super', 'fire', 'sweet'];
const secondWords = ['bear', 'kitty', 'chimp', 'parrot', 'puppy', 'sloth', 'python', 'owl', 'tiger', 'eagle'];
// For slug URL concatenation:
const firstWord = firstWords[Math.floor(Math.random() * firstWords.length)];
const secondWord = secondWords[Math.floor(Math.random() * secondWords.length)];

function generateSlug(): string {
  // Return concatenated URL slug for event's main link
  const unique = nanoid(12);
  return `${firstWord}-${secondWord}-${unique}`  // e.g. "happy-chimp-a3X9k25vRk9L"
}

  
function generateEditCode(): string {
  const secureUnique = nanoid(25)    // Longer slug = more secure for host event-editing access
  // Return concatenated URL slug for event-host editing link
  return `${firstWord}-${secondWord}-${secureUnique}`
}


export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Create the event with guaranteed unique codes
    const eventData = {
      name: body.name,
      description: body.description || null,
      date: body.date || null,
      location: body.location || null,
      url_slug: generateSlug(),               // Guaranteed unique
      host_edit_code: generateEditCode()      // Also guaranteed unique
    }
    
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, data })
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
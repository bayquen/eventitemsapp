import { supabase } from '@/lib/supabase';          // For user-created Events database
import { NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';    // NanoID package is for production-grade unique string ID generation!


// Generate unique URL slug upon creation of an event
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');   // custom alphanumeric URL generation, 2nd param is char length of slug URL
// Make lists of fun words to use for slug URL generation
const firstWords = ['cringey', 'vibey', 'nonchalant', 'saucy', 'chill', 'goofy', 'swaggy', 'explosive', 'performative', 'auraful', 'super', 'demure', 'rowdy', 'fire', 'sweet', 'salty'];
const secondWords = ['grizzly', 'cat', 'chimp', 'parrot', 'puppy', 'husky', 'shiba', 'sloth', 'dragon', 'tortoise', 'tiger', 'eagle', 'wolf', 'armadillo', 'gorilla'];
// For slug URL concatenation:
const firstWord = firstWords[Math.floor(Math.random() * firstWords.length)];
const secondWord = secondWords[Math.floor(Math.random() * secondWords.length)];

function generateSlug(): string {
  // Return concatenated URL slug for event's main link
  const unique = nanoid(15);
  return `${firstWord}-${secondWord}-${unique}`  // e.g. "happy-chimp-a3X9h..."
}

// Brandon's TODO: (AFTER MVP in production?) - For a given event, match first two generated words for
//      main URL slug name match w/ HOST URL slug (e.g. "event/vibey-cat..." for both URLs). Reason: for consistency.
function generateEditCode(): string {
  const secureUnique = nanoid(20)    // Longer slug = more secure for host event-editing access
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
      time: body.time || null,
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
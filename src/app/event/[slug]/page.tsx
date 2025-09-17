import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';    // to show 404 page as needed

interface PageProps {   // Defines that this page receives URL params w/ a slug
    params: { slug: string }
}

async function getEvent(slug: string) {
    // 1st Query: Find event w/ matching url_slug
    const { data: event, error } = await supabase
        .from('events')          // look in 'events' table
        .select('*')             // Get all columns
        .eq('url_slug', slug)    // e.g. WHERE url_slug = 'happy-party-1234'
        .single()                // Expect exactly 1 result

    if (error || !event) return null

    // 2nd Query: Get all items for this event
    const { data: items } = await supabase
        .from('items')               // Look in 'items' table
        .select('*')
        .eq('event_id', event.id)    // WHERE event_id matches this event
        .order('category')           // Sort by category (e.g. Food, Drinks, Decor, etc.)
        .order('created_at')         // Then by creation time

    return { ...event, items: items || [] }    // Combine event + items into one object 
}
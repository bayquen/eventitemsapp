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

export default async function EventPage({ params }: PageProps) {
    const event = await getEvent(params.slug)

    if (!event) {
        notFound()  // Trigger 404 page if event doesn't exist
    }

    const eventDate = event.date 
    ? new Date(event.date).toLocaleString('en-US;', {   // Convert timestamp to readable format
        weekday: 'long',    // e.g. "Saturday"
        month: 'long',      //      "March"
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
    : null    // Set to null if no date

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                
                <div className= "bg-white rounded-lg shadow-md p-6 mb-6">
                    {/* SECTION: Event Header (yayy) */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>

                    {event.description && (
                        <p className="text-gray-700 mb-4">{event.description}</p>
                    )}

                    <div className="space-y-2 text-gray-600">
                        {eventDate && (
                            <div className="flex-items-center">
                                <span className="font-semibold mr-2">📅 When:</span>
                                <span>{eventDate}</span>
                            </div>
                        )}

                        {event.location && (
                            <div className="flex-items-center">
                                <span className="font-semibold mr-2">📍 Where:</span>
                                <span>{event.location}</span>
                            </div>
                        )}
                    </div>

                    {/* SECTION: Share Link (yayyy) */}
                    

                </div>

            </div>
        </div>
    )
}
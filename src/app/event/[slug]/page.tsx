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
    ? new Date(event.date).toLocaleString('en-US', {   // Convert timestamp to readable format
        weekday: 'long',    // e.g. "Saturday"
        year: 'numeric',
        month: 'long',      // e.g. "March"
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
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Share this event:</p>
                        <div className="flex items-center gap-2">
                            <input
                            type="text"
                            readOnly
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/event/${event.url_slug}`}
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                            />    
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/event/${event.url_slug}`)
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                            >
                                Copy
                            </button>                
                        </div>
                    </div>
                </div>
                
                {/* SECTION: Items */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Items Needed</h2>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">
                            + Add Item
                        </button>
                    </div>
                    
                    {event.items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No items added yet</p>
                            <p className="text-sm mt-2">Be the first to add what&apos;s needed for this event!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                        {/* Group items by category */}
                            {Object.entries(
                                event.items.reduce((acc: any, item: any) => {
                                    if (!acc[item.category]) acc[item.category] = []
                                    acc[item.category].push(item)
                                    return acc
                                }, {})
                            ).map(([category, categoryItems]: [string, any]) => (
                                <div key={category} className="border rounded-lg p-4">
                                    <h3 className="font-semibold text-lg mb-3 text-gray-700">{category}</h3>
                                    <div className="space-y-2">
                                        {categoryItems.map((item: any) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                                <div>
                                                    <span className="font-medium">{item.name}</span>
                                                    {item.quantity > 1 && (
                                                        <span className="text-sm text-gray-500 ml-2">(x{item.quantity})</span>
                                                    )}
                                                    {item.notes && (
                                                        <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    {item.claimed_by ? (
                                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                            ✓ {item.claimed_by}
                                                        </span>
                                                    ) : (
                                                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200">
                                                            Claim this
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
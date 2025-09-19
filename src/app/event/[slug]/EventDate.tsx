'use client'

interface EventDateProps {
    date: string | null
}

export default function EventDate({ date }: EventDateProps) {
    if (!date) return null

    const eventDate = new Date(date).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // hour: 'numeric',
        // minute: '2-digit',
        // timeZoneName: 'short'   // e.g. "PDT", "EST"
    })

    return (
        <div className="flex items-center">
            <span className="font-semibold mr-2">📅 </span>
            <span>{eventDate}</span>
        </div>
    )
}
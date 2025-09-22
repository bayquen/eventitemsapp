'use client';

interface EventDateProps {
    date: string | null
    time: string | null
}

export default function EventDate({ date, time }: EventDateProps) {
    if (!date) return null

    const eventDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    let formattedTime = null
    if (time) {
        try {
            const [hours, minutes] = time.split(':')
            const hour = parseInt(hours)
            const min = parseInt(minutes)
            const amPm = hour >= 12 ? 'PM' : 'AM'
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
            formattedTime = `${displayHour}:${min.toString().padStart(2, '0')} ${amPm}`
        } catch (e) {
            formattedTime = null
        }
    }

    return (
        <>
            <div className="flex items-center">
                <span className="font-semibold mr-2">📅 </span>
                <span>{eventDate}</span>
            </div>
            {formattedTime && (
                <div className="flex items-center">
                    <span className="font-semibold mr-2">🕐 </span>
                    <span>{formattedTime}</span>
                </div>
            )}
        </>
    )
}
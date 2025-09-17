// Testing, not for production. Delete later

import { supabase } from '@/lib/supabase'

export default async function TestPage() {
    // Test fetching events (should return empty array initially)
    const { data: events, error } = await supabase
    .from('events')
    .select('*')
  
  if (error) {
    return <div>Error: {error.message}</div>
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <p>Connected successfully! ✅</p>
      <p>Number of events: {events?.length || 0}</p>
    </div>
  )
}
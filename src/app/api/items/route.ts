import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { data, error } = await supabase
            .from('items')
            .insert({
                event_id: body.event_id,
                name: body.name,
                category: body.category,
                quantity: body.quantity || 1,
                notes: body.notes || null,
                claimed_by: body.claimed_by || null
            })
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
'use client';
import { useState } from 'react';
import AddItemModal from './AddItemModal';

interface AddItemButtonProps {
    eventId: string
}

export default function AddItemButton({ eventId }: AddItemButtonProps) {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
                Add Item
            </button>
            <AddItemModal
                eventId={eventId}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    )
}
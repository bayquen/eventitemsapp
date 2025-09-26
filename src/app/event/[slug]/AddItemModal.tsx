'use client';

import { useState } from 'react';
import { useRouter } from  'next/navigation';

interface AddItemModalProps {
    eventId: string
    isOpen: boolean
    onClose: () => void
}

export default function AddItemModal({ eventId, isOpen, onClose }: AddItemModalProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '1',
        notes: '',
        claimed_by: ''
    })

    // Preset item categories
    const itemCategories = [
        'Food',
        'Drinks',
        'Supplies',
        'Decorations',
        'Equipment',
        'Electronics',
        'Services'
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/items/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_id: eventId,
                    ...formData,
                    quantity: parseInt(formData.quantity)
                })
            })

            const result = await response.json()

            if (result.success) {
                router.refresh()    // Refresh page to show new item
                onClose()           // Close the modal (i.e. pop-up window)
                setFormData({
                    name: '',
                    category: '',
                    quantity: '1',
                    notes: '',
                    claimed_by: ''
                })
            } else {
                alert('Error adding item: ' + result.error)
            }
        } catch (error : any) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Add Item </h2>

                <form onSubmit={handleSubmit}>
                    {/* Item Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Item Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className= "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder=""
                        />
                    </div>

                    {/* Item Category */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category *
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select item category...</option>
                            {itemCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Item Quantity */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Quantity
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    {/* Person's Name (if claiming item) */}
                    <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Your Name (if claiming or bringing item)
                    </label>
                    <input
                        type="text"
                        value={formData.claimed_by}
                        onChange={(e) => setFormData({...formData, claimed_by: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=""
                    />
                    </div>
                    {/* Item Notes */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Notes
                        </label>    
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Any specific details or notes for this item..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading || !formData.name || !formData.category}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}
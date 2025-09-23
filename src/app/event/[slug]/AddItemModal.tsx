'use client';

import { useState } from 'react';
import { useRouter } from  'next/navigation';

interface AddItemModalProps {
    eventId: string
    isOpen: boolean
    onClose: () => void
}

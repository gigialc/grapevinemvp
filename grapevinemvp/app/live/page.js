"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

const Live = () => {
    const [mode, setMode] = useState('');
    const router = useRouter();

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
        router.push(`/live/${selectedMode}`);
    }

    return (
        <div>
            <h1>Choose Your Mode</h1>
            <button onClick={() => handleModeChange('spectate')}>Spectate</button>
            <button onClick={() => handleModeChange('participate')}>Participate</button>
            <p>Current Mode: {mode}</p>
        </div>
    );
}

export default Live

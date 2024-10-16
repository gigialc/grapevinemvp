"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHandsHelping } from '@fortawesome/free-solid-svg-icons';

const Live = () => {
    const [mode, setMode] = useState('');
    const router = useRouter();

    const handleModeChange = (selectedMode) => {
        setMode(selectedMode);
        router.push(`/live/${selectedMode}`);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 to-indigo-800 text-white">
            <h1 className="text-4xl font-bold mb-8">Choose Your Mode</h1>
            <div className="flex space-x-6">
                <button 
                    onClick={() => handleModeChange('spectate')}
                    className="flex flex-col items-center bg-white text-purple-800 px-6 py-4 rounded-lg shadow-lg hover:bg-purple-100 transition duration-300"
                >
                    <FontAwesomeIcon icon={faEye} className="text-3xl mb-2" />
                    <span className="text-lg font-semibold">Spectate</span>
                </button>
                <button 
                    onClick={() => handleModeChange('participate')}
                    className="flex flex-col items-center bg-white text-purple-800 px-6 py-4 rounded-lg shadow-lg hover:bg-purple-100 transition duration-300"
                >
                    <FontAwesomeIcon icon={faHandsHelping} className="text-3xl mb-2" />
                    <span className="text-lg font-semibold">Participate</span>
                </button>
            </div>
            {mode && (
                <p className="mt-8 text-xl">
                    Current Mode: <span className="font-semibold">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
                </p>
            )}
        </div>
    );
}

export default Live;
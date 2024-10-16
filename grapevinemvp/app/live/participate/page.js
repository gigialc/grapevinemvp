"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import MonacoEditor from '@/app/components/MonacoEditor';
import LiveChat from '@/app/components/LiveChat';
import Timer from '@/app/components/Timer';
// import Leaderboard from '@/app/components/Leaderboard';

const Participate = () => {
    const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
    const [score, setScore] = useState(0);
    const [challenge, setChallenge] = useState(null);
    const [submission, setSubmission] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Fetch challenge details
        fetchChallenge();
    }, []);

    const fetchChallenge = async () => {
        // Fetch challenge details from API
        const response = await fetch('/api/challenge');
        const data = await response.json();
        setChallenge(data);
    };

    const handleSubmit = async () => {
        // Submit code for evaluation
        const response = await fetch('/api/submit', {
            method: 'POST',
            body: JSON.stringify({ code: submission }),
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        setScore(result.score);
    };

    const handleEditorChange = (value) => {
        setSubmission(value);
    };

    return (
        <div className="flex flex-col h-screen">
            <header className="bg-purple-600 text-white p-4">
                <h1 className="text-2xl font-bold">Project Challenge</h1>
                <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
            </header>
            <main className="flex-grow flex">
                <div className="w-2/3 p-4">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">{challenge?.title}</h2>
                        <p>{challenge?.description}</p>
                    </div>
                    <MonacoEditor
                        height="60vh"
                        language="javascript"
                        theme="vs-dark"
                        value={submission}
                        onChange={handleEditorChange}
                    />
                    <button 
                        onClick={handleSubmit}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Submit Solution
                    </button>
                </div>
                <div className="w-1/3 p-4 bg-gray-100">
                    {/* <Leaderboard /> */}
                    <LiveChat />
                </div>
            </main>
            <footer className="bg-gray-200 p-4">
                <p>Your current score: {score}</p>
            </footer>
        </div>
    );
}

export default Participate;
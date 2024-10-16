import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchLeaderboard = async () => {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setLeaderboard(data);
    };

    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Leaderboard</h3>
            <ul>
                {leaderboard.map((entry, index) => (
                    <li key={index} className="flex justify-between">
                        <span>{entry.name}</span>
                        <span>{entry.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
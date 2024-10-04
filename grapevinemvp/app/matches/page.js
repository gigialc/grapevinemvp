'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from "../components/Navbar";

export default function Matches() {
  const { data: session, status } = useSession();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      fetchMatches(session.user.email);
    }
  }, [session]);

  const fetchMatches = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/matches?email=${email}`);
      if (response.ok) {
        const matchesData = await response.json();
        setMatches(matchesData);
      } else {
        console.error('Failed to fetch matches');
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async (matchId) => {
    // Implement the logic to notify the matched person
    // This could be an API call to update the match status
  };

  if (status === 'loading' || loading) {
    return <div>Loading matches...</div>;
  }

  return (
    <div>
      <Navbar />
      <h1>Your Matches</h1>
      {matches.length === 0 ? (
        <p>No matches found yet. Keep exploring!</p>
      ) : (
        <ul>
          {matches.map((match) => (
            <li key={match.id}>
              <h2>{match.name}</h2>
              <p>School: {match.school}</p>
              <p>Project Idea: {match.projectIdea}</p>
              <p>Skills: {match.skills.join(', ')}</p>
              <button onClick={() => handleMatch(match.id)}>
                Connect with {match.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
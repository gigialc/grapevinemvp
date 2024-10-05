import connectDB from '../../mongodb';
import User from '@/models/User';

function calculateSimilarity(user1, user2) {
  let score = 0;

  // Calculate similarity based on common skills
  const commonSkills = user1.skills.filter(skill => user2.skills.includes(skill));
  score += commonSkills.length * 2;

  // Add score if project interest matches
  if (user1.projectInterest === user2.projectInterest) {
    score += 3;
  }

  // Calculate similarity based on common interests
  const commonInterests = user1.interests.filter(interest => user2.interests.includes(interest));
  score += commonInterests.length;

  return score;
}

export async function matchServices() {
  await connectDB();
  try {
    const users = await User.find(); 

    // Create a network object to store connections for each user
    const userNetworks = {};

    for (const seedUser of users) {
      // Initialize an array to store matches for this user
      const matches = [];

      for (const user of users) {
        if (user._id.equals(seedUser._id)) {
          continue; // Skip matching the user with themselves
        }

        const score = calculateSimilarity(seedUser, user);
        matches.push({ user: user._id, score });
      }

      // Sort matches based on score (highest similarity first)
      matches.sort((a, b) => b.score - a.score);

      // Store the top N matches for this user (you can decide how many)
      userNetworks[seedUser._id] = matches.slice(0,2); // Example: top 10 matches
    }

    // Optionally save the network information to the database
    for (const [userId, matches] of Object.entries(userNetworks)) {
      const user = await User.findById(userId);
      user.recommendations = matches.map(match => match.user); // Store user IDs of matches
      await user.save();
    }

    return userNetworks;
  } catch (error) {
    console.error("Error creating individualized networks:", error);
    throw error;
  }
}

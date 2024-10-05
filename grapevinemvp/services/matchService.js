import User from '../models/User';

function calculateSimilarity(user1, user2) {
  let score = 0;

  const commonSkills = user1.skills.filter(skill => user2.skills.includes(skill));
  score += commonSkills.length * 2;

  if (user1.projectInterest === user2.projectInterest) {
    score += 3;
  }

  const commonInterests = user1.interests.filter(interest => user2.interests.includes(interest));
  score += commonInterests.length; 

  return score;
}

async function matchUsers() {
  try {
    const users = await User.find();
    const groups = [];
    
    while (users.length >= 4) {
      let group = [];
      let seedUser = users.pop();
      group.push(seedUser);
      
      for (let i = 0; i < 3; i++) {
        let bestMatch = null;
        let highestScore = -1;

        users.forEach(user => {
          let score = calculateSimilarity(seedUser, user);
          if (score > highestScore) {
            bestMatch = user;
            highestScore = score;
          }
        });

        if (bestMatch) {
          group.push(bestMatch);
          users.splice(users.indexOf(bestMatch), 1);
        }
      }

      groups.push(group);
    }

    return groups;
  } catch (error) {
    console.error("Error matching users:", error);
  }
}

export default matchUsers;
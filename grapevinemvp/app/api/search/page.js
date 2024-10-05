import { connectDB } from '@/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    try {
      await connectDB();

      // Create a text index on relevant fields (if not already created)
      await User.collection.createIndex({
        name: 'text',
        bio: 'text',
        skills: 'text',
        projectInterest: 'text'
      });

      // Perform text search
      const users = await User.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20) // Limit results to 20
      .select('-password'); // Exclude password field

      res.status(200).json(users);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'An error occurred during search' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

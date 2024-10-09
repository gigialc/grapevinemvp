import Image from 'next/image';
import Link from 'next/link';

const UserCard = ({ user }) => {
  return (
    <Link href={`/profile/${user._id}`} className="block">
      <div className="user-card bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-3">
          <div className="relative w-16 h-16 mr-3 flex-shrink-0">
            <Image
              src={user.profileImage || '/images/default-avatar.png'}
              alt={user.name}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-avatar.png';
              }}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
          </div>
        </div>
        
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Bio</h3>
          <p className="text-sm text-gray-600 italic">{user.bio || 'No bio provided'}</p>
        </div>
        
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Interests</h3>
          <div className="flex flex-wrap gap-1">
            {user.interests.map((interest, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Skills</h3>
          <p className="text-sm text-gray-600">{user.skills.join(', ')}</p>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
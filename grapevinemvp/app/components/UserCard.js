import Image from 'next/image';
import Link from 'next/link';

const UserCard = ({ user }) => {
  return (
    <Link href={`/profile/${user._id}`} className="block hover:shadow-lg transition-shadow duration-300">
      <div className="user-card bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row items-left mb-4 sm:mb-6">
          <div className="relative w-20 h-20 mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
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
          <div className="text-left sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm sm:text-base text-gray-600 italic">{user.bio || 'No bio provided'}</p>
          </div>
        </div>
        
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Project Interest</h3>
          <p className="text-sm sm:text-base mb-3">{user.interests.join(', ')}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;
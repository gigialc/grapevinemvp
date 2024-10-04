// components/UserCard.js
import React from 'react';
import Link from 'next/link';

const UserCard = ({ user }) => {
  return (
    <div className="user-card border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.bio}</p>
      <h3 className="mt-4 font-semibold">Projects:</h3>
      <ul className="list-disc list-inside">
        {user.projects.map(project => (
          <li key={project._id}>
            <Link href={`/project/${project._id}`}>
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserCard;
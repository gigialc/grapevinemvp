'use client'

import React, { useState, useEffect } from 'react';
import './Browse.css';

export default function Browse() {
  const [positions, setPositions] = useState([
    { id: 1, name: 'Music', profiles: 4, position: { left: '20%', top: '30%' }, velocity: { x: 0.2, y: 0.2 }, expanded: false },
    { id: 2, name: 'Art', profiles: 3, position: { left: '70%', top: '20%' }, velocity: { x: -0.2, y: 0.2 }, expanded: false },
    { id: 3, name: 'Software', profiles: 2, position: { left: '50%', top: '60%' }, velocity: { x: 0.2, y: -0.2 }, expanded: false },
    { id: 4, name: 'Fashion', profiles: 5, position: { left: '30%', top: '80%' }, velocity: { x: -0.2, y: -0.2 }, expanded: false }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prevPositions => 
        prevPositions.map(group => {
          if (!group.expanded) {
            const newPosition = moveCircle(group);
            return { ...group, position: newPosition };
          }
          return group;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const moveCircle = (group) => {
    const { left, top } = group.position;
    const { x, y } = group.velocity;

    let newLeft = parseFloat(left) + x;
    let newTop = parseFloat(top) + y;

    if (newLeft > 80 || newLeft < 0) group.velocity.x *= -1;
    if (newTop > 80 || newTop < 0) group.velocity.y *= -1;

    newLeft = parseFloat(left) + group.velocity.x;
    newTop = parseFloat(top) + group.velocity.y;

    return { left: `${newLeft}vw`, top: `${newTop}vh` };
  };

  const toggleExpand = (id) => {
    setPositions(prevPositions =>
      prevPositions.map(group => {
        if (group.id === id) {
          return { ...group, expanded: !group.expanded };
        }
        return group;
      })
    );
  };

  return (
    <main className="container mx-auto px-4 relative">
      <div className="circle-container">
        {positions.map(group => (
          <div
            key={group.id}
            className={`circle ${group.expanded ? 'expanded' : ''}`}
            style={{
              position: 'absolute',
              left: group.position.left,
              top: group.position.top
            }} 
            onClick={() => toggleExpand(group.id)} 
          >
            <span>{group.name}</span>
            {group.expanded && group.profiles > 0 && (
              <div className="profiles">
                {[...Array(group.profiles)].map((_, idx) => (
                  <div key={idx} className="profile"></div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

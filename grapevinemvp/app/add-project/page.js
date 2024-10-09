'use client'

import { Suspense } from 'react';
import AddProjectContent from '../components/AddProjectContent';

export default function AddProject() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProjectContent />
    </Suspense>
  );
}
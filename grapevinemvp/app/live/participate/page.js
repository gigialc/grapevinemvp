"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import MonacoEditor from '@/app/components/MonacoEditor';

const Participate = () => {
    return (
        <div>
            <h1>You are a participant</h1>
            <MonacoEditor />
        </div>
    );
}

export default Participate
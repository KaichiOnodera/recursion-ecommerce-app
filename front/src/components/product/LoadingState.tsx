import React from 'react';
import { BackLink } from './BackLink';

export const LoadingState: React.FC = () => (
  <div className="container mx-auto py-8 px-4 max-w-6xl">
    <BackLink />
    <div className="text-center py-16">読み込み中...</div>
  </div>
);

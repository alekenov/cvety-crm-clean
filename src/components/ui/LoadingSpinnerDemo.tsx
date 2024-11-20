import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const LoadingSpinnerDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Размеры</h3>
        <div className="flex items-center gap-4">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Варианты</h3>
        <div className="flex items-center gap-4">
          <LoadingSpinner variant="primary" />
          <LoadingSpinner variant="secondary" />
          <div className="p-4 bg-blue-600 rounded">
            <LoadingSpinner variant="white" />
          </div>
        </div>
      </div>
    </div>
  );
};

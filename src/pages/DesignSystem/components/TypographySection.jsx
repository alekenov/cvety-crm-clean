import React from 'react';
import { Caption } from '../../../components/ui/Typography';

export const TypographySection = ({ title, children }) => {
  return (
    <div className="space-y-6">
      <div>
        <Caption color="secondary" className="mb-4">{title}</Caption>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

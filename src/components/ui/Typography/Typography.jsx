import React from 'react';
import { TYPOGRAPHY } from '../../../styles/typography';

// Компонент для заголовков
export const Heading = ({ level = 1, children, className = '' }) => {
  const Tag = `h${level}`;
  const baseStyle = TYPOGRAPHY[`h${level}`];
  
  return (
    <Tag className={`${baseStyle} ${className}`}>
      {children}
    </Tag>
  );
};

// Компонент для основного текста
export const Text = ({ 
  size = 'base', 
  children, 
  className = '',
  state,
}) => {
  const baseStyle = TYPOGRAPHY.body[size];
  const stateStyle = state ? TYPOGRAPHY.states[state] : '';
  
  return (
    <p className={`${baseStyle} ${stateStyle} ${className}`}>
      {children}
    </p>
  );
};

// Компонент для подписей
export const Label = ({ children, className = '' }) => {
  return (
    <span className={`${TYPOGRAPHY.label} ${className}`}>
      {children}
    </span>
  );
};

// Компонент для мелкого текста
export const Caption = ({ children, className = '' }) => {
  return (
    <span className={`${TYPOGRAPHY.caption} ${className}`}>
      {children}
    </span>
  );
};

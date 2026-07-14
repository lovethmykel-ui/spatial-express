import React from 'react';
import clsx from 'clsx';

interface CountryFlagProps {
  countryCode: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-2xl'
};

export const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode, className, size = 'md' }) => {
  if (!countryCode) return null;
  
  const code = countryCode.toLowerCase();
  
  return (
    <span 
      className={clsx(`fi fi-${code} rounded-sm overflow-hidden shadow-sm inline-block`, sizeClasses[size], className)}
      title={countryCode}
    />
  );
};

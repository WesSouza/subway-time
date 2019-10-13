import React, { ReactNode } from 'react';

import styles from './styles.css';

interface Props {
  children?: ReactNode;
  className?: string;
  onClick: () => void;
  type?: 'button' | 'submit';
}

export const ButtonLink = ({ children, className, onClick, type }: Props) => {
  return (
    <button
      className={`${styles.ButtonLink} ${className || ''}`}
      onClick={onClick}
      type={type || 'button'}
    >
      {children}
    </button>
  );
};

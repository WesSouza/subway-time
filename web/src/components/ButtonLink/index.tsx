import React, { ReactNode } from 'react';

import styles from './styles.css';

interface IProps {
  children?: ReactNode;
  className?: string;
  onClick: () => void;
  type?: 'button' | 'submit';
}

export const ButtonLink = ({ children, className, onClick, type }: IProps) => {
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

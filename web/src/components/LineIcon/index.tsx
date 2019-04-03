import React, { ReactNode } from 'react';

import { LineColorMap } from '~/constants/lines';

import styles from './styles.css';

interface IProps {
  children?: ReactNode;
  className?: string;
  color?: string;
}

export const LineIcon = ({ children, className, color }: IProps) => {
  let backgroundColor: string | undefined = color;
  if (typeof children === 'string' && LineColorMap[children]) {
    backgroundColor = `var(${LineColorMap[children]})`;
  }

  return (
    <div
      className={`${styles.LineIcon} ${className || ''}`}
      style={{ backgroundColor }}
    >
      {children || ' '}
    </div>
  );
};
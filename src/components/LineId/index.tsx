import * as React from 'react';

import styles from './styles.css';

interface Props {
  id: string;
  className?: string;
  color: string | null;
  style?: { [s: string]: string | number };
}

const LineId = ({ id, className, color: backgroundColor, style }: Props) => {
  backgroundColor = backgroundColor || '#666';
  const color = /^[nrqw]/i.test(id) ? '#000' : '#fff';
  return (
    <div
      className={`${styles.LineId} ${className || ''}`}
      style={{
        ...style,
        color,
        backgroundColor,
      }}
    >
      {id}
    </div>
  );
};

export default LineId;

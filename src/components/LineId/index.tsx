import colorContrast from 'color-contrast';
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
  const color = colorContrast('#fff', backgroundColor) > 1.5 ? '#fff' : '#000';
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

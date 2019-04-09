import React from 'react';

import styles from './styles.css';

interface IProps {
  width?: number;
}

export const LoadingBlock = ({ width }: IProps) => {
  return (
    <div className={styles.LoadingBlock} style={{ width }}>
      &nbsp;
    </div>
  );
};

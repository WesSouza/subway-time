import React from 'react';

import * as styles from './styles.css';

interface Props {
  width?: number;
}

export const LoadingBlock = ({ width }: Props) => {
  return (
    <div className={styles.LoadingBlock} style={{ width }}>
      &nbsp;
    </div>
  );
};

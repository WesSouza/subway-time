import React, { ReactNode } from 'react';

import { LineIcon } from '../LineIcon';
import * as styles from './styles.css';

interface Props {
  children?: ReactNode;
  icon?: ReactNode;
  lineId?: string;
  subtitle?: ReactNode;
  title?: ReactNode;
}

export const LinedBlock = ({
  children,
  icon,
  lineId,
  subtitle,
  title,
}: Props) => {
  return (
    <div className={styles.LinedBlock}>
      <div className={styles.line}>
        {lineId || icon ? (
          <div className={styles.icon}>
            {lineId ? <LineIcon>{lineId}</LineIcon> : icon}
          </div>
        ) : null}
      </div>
      <div
        className={`${styles.content} ${
          lineId && title ? styles.alignLineIdTitle : ''
        }`}
      >
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        {children && <div className={styles.children}>{children}</div>}
      </div>
    </div>
  );
};

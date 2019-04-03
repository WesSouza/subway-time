import React, { ReactNode } from 'react';

import { ButtonLink } from '../ButtonLink';

import styles from './styles.css';

interface IProps {
  children: ReactNode;
  retryOnClick?: () => void;
}

const ErrorMessage = ({ children, retryOnClick }: IProps) => {
  return (
    <div className={styles.ErrorMessage}>
      <div className={styles.message}>
        {children}
        {retryOnClick && (
          <>
            <br />
            <br />
            <ButtonLink onClick={retryOnClick}>Try again</ButtonLink>
          </>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

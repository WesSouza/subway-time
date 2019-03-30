import React, { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  retryOnClick?: () => void;
}

import styles from './styles.css';

const ErrorMessage = ({ children, retryOnClick }: IProps) => {
  return (
    <div className={styles.ErrorMessage}>
      <div className={styles.message}>
        {children}
        {retryOnClick && (
          <>
            <br />
            <br />
            <button
              className={styles.errorRetry}
              onClick={retryOnClick}
              type="button"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;

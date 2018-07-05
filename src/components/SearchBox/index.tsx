import * as React from 'react';

import styles from './styles.css';

interface IProps {
  onChange: (e: React.SyntheticEvent) => void;
}

const SearchBox = ({ onChange }: IProps) => (
  <form className={styles.SearchBox}>
    <input
      aria-label="Subway station search"
      className={styles.searchInput}
      name="search"
      type="search"
      onChange={onChange}
    />
  </form>
);

export default SearchBox;

import { Link } from '@reach/router';
import * as React from 'react';

import styles from './styles.css';

interface Props {
  onSearchCommitValue?: () => void;
  onSearchChange?: (e: React.SyntheticEvent) => void;
  onSearchChangeWithValue?: (value: string) => void;
  onSearchFocusWithValue?: (value: string) => void;
}

class NavigationBar extends React.Component<Props> {
  public render() {
    return (
      <div className={styles.NavigationBar}>
        <form className={styles.searchBox} onSubmit={this.onSubmit}>
          <input
            aria-label="Subway station search"
            autoComplete="off"
            className={styles.searchInput}
            name="search"
            onBlur={this.props.onSearchCommitValue}
            onChange={this.onSearchChange}
            onFocus={this.onSearchFocus}
            placeholder="Search station name"
            type="search"
          />
        </form>
        <div className={styles.menuItems}>
          <Link className={styles.menuItem} to="/">
            Home
          </Link>
          <Link className={styles.menuItem} to="/map">
            Map
          </Link>
        </div>
      </div>
    );
  }

  private onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const { onSearchCommitValue } = this.props;
    if (onSearchCommitValue) {
      onSearchCommitValue();
    }
  };

  private onSearchChange = (event: React.SyntheticEvent) => {
    const { onSearchChange, onSearchChangeWithValue } = this.props;
    if (onSearchChange) {
      onSearchChange(event);
    }
    if (onSearchChangeWithValue) {
      onSearchChangeWithValue((event.target as HTMLInputElement).value);
    }
  };

  private onSearchFocus = (event: React.SyntheticEvent) => {
    const { onSearchFocusWithValue } = this.props;
    if (onSearchFocusWithValue) {
      onSearchFocusWithValue((event.target as HTMLInputElement).value);
    }
  };
}

export default NavigationBar;

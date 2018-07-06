import * as React from 'react';

import styles from './styles.css';

interface IProps {
  onCommitValue?: () => void;
  onChange?: (e: React.SyntheticEvent) => void;
  onChangeWithValue?: (value: string) => void;
}

class SearchBox extends React.Component<IProps> {
  public render() {
    return (
      <form className={styles.SearchBox} onSubmit={this.onSubmit}>
        <input
          aria-label="Subway station search"
          className={styles.searchInput}
          name="search"
          onBlur={this.props.onCommitValue}
          onChange={this.onChange}
          type="search"
        />
      </form>
    );
  }

  private onSubmit = (event: React.SyntheticEvent) => {
    const { onCommitValue } = this.props;
    if (onCommitValue) {
      event.preventDefault();
      onCommitValue();
    }
  };

  private onChange = (event: React.SyntheticEvent) => {
    const { onChange, onChangeWithValue } = this.props;
    if (onChange) {
      onChange(event);
    }
    if (onChangeWithValue) {
      onChangeWithValue((event.target as HTMLInputElement).value);
    }
  };
}

export default SearchBox;

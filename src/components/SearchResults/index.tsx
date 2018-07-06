import { Link } from '@reach/router';
import * as React from 'react';

import { IStation } from 'models/models';

import styles from './styles.css';

interface IProps {
  stations: IStation[];
  onClick?: () => void;
}

const SearchResults = ({ stations, onClick }: IProps) => (
  <ul className={styles.SearchResults}>
    {stations.map(station => (
      <li key={station.id} className={styles.station}>
        <Link to={`/station/${station.id}`} onClick={onClick}>
          <div className={styles.lines}>
            {station.lines.map((line, index, lines) => (
              <div
                key={line.id}
                className={styles.lineId}
                style={{
                  backgroundColor: line.color,
                  zIndex: lines.length - index,
                }}
              >
                {line.id}
              </div>
            ))}
          </div>
          <div className={styles.name}>{station.name}</div>
          {station.distance && (
            <div className={styles.distance}>{station.distance}</div>
          )}
        </Link>
      </li>
    ))}
  </ul>
);

export default SearchResults;

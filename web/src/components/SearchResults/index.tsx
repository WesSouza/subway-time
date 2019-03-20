import { Link } from '@reach/router';
import * as React from 'react';

import LineId from '~/components/LineId';

import { IStation } from '~/state/station';

import styles from './styles.css';

interface IProps {
  stations: IStation[];
  onClick?: () => void;
}

const SearchResults = ({ stations, onClick }: IProps) => (
  <ul className={styles.SearchResults}>
    {stations.map(station => (
      <li key={station.id} className={styles.station}>
        <Link
          className={styles.link}
          onClick={onClick}
          to={`/station/${station.id}`}
        >
          <div className={styles.lines}>
            {station.lines.map((line, index, lines) => (
              <LineId
                id={line.id}
                key={line.id}
                color={line.color}
                className={styles.lineId}
                style={{
                  zIndex: lines.length - index,
                }}
              />
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

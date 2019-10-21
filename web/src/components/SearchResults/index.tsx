import { Link } from '@reach/router';
import * as React from 'react';

import LineId from '~/components/LineId';
import { Entities } from '~/lib/entities';
import { Line } from '~/state/line/types';
import { Station } from '~/state/station/types';

import styles from './styles.css';

interface Props {
  linesById: Entities<Line>;
  stations: Station[];
  onClick?: () => void;
}

const SearchResults = ({ linesById, stations, onClick }: Props) => (
  <ul className={styles.SearchResults}>
    {stations.map(station => (
      <li key={station.id} className={styles.station}>
        <Link
          className={styles.link}
          onClick={onClick}
          to={`/station/${station.id}`}
        >
          <div className={styles.lines}>
            {station.lineIds.map((lineId, index, lines) => (
              <LineId
                id={lineId}
                key={lineId}
                color={linesById[lineId] ? linesById[lineId].color : null}
                className={styles.lineId}
                style={{
                  zIndex: lines.length - index,
                }}
              />
            ))}
          </div>
          <div className={styles.name}>{station.name}</div>
        </Link>
      </li>
    ))}
  </ul>
);

export default SearchResults;

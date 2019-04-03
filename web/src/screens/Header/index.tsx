import { Link } from '@reach/router';
import React, { useState, useEffect } from 'react';

import NavigationBar from '~/components/NavigationBar';
import { LinedBlock } from '~/components/LinedBlock';
import { LineIcon } from '~/components/LineIcon';
import SearchResults from '~/components/SearchResults';

import { stationState, IStation } from '~/state/station';
import { lineState } from '~/state/line';
import { search } from '~/state/station/helpers';

import styles from './styles.css';

interface IProps {
  path?: string;
}

export const Header = ({  }: IProps) => {
  const [linesById] = lineState.useFutureObserver(({ linesById }) => linesById);
  const [stationsById] = stationState.useFutureObserver(
    ({ stationsById }) => stationsById,
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [resultStations, setResultStations] = useState<IStation[]>([]);

  useEffect(() => {
    if (stationsById) {
      setResultStations(search(Object.values(stationsById), searchTerm));
    }
  }, [stationsById, searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <>
      <LinedBlock
        icon={
          <div className={styles.logoIcons}>
            <LineIcon
              className={styles.logoIcon}
              color={'var(--color-line-blue)'}
            />
            <LineIcon
              className={styles.logoIcon}
              color={'var(--color-line-lightGreen)'}
            />
            <LineIcon
              className={styles.logoIcon}
              color={'var(--color-line-yellow)'}
            />
            <LineIcon
              className={styles.logoIcon}
              color={'var(--color-line-red)'}
            />
          </div>
        }
      >
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>
            <Link to="/"> SubwayTi.me</Link>
          </h1>
        </header>
      </LinedBlock>
      <NavigationBar
        onSearchChangeWithValue={setSearchTerm}
        onSearchFocusWithValue={setSearchTerm}
      />
      {linesById && resultStations.length ? (
        <SearchResults
          linesById={linesById}
          stations={resultStations}
          onClick={clearSearch}
        />
      ) : null}
    </>
  );
};

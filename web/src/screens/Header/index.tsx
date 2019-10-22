import { Link } from '@reach/router';
import React, { useState, useEffect } from 'react';

import NavigationBar from '~/components/NavigationBar';
import { LinedBlock } from '~/components/LinedBlock';
import { LineIcon } from '~/components/LineIcon';
import SearchResults from '~/components/SearchResults';

import { stationStore } from '~/state/station/store';
import { Station } from '~/state/station/types';
import { lineStore } from '~/state/line/store';
import { getLinesById } from '~/state/line/selectors';
import { search } from '~/state/station/helpers';
import { getStationsById } from '~/state/station/selectors';

import styles from './styles.css';

interface Props {
  path?: string;
}

export const Header = ({  }: Props) => {
  const [linesById] = lineStore.useSelector(getLinesById);
  const [stationsById] = stationStore.useSelector(getStationsById);

  const [searchTerm, setSearchTerm] = useState('');
  const [resultStations, setResultStations] = useState<Station[]>([]);

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

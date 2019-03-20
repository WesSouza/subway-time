import React, { useState, useEffect } from 'react';

import NavigationBar from '~/components/NavigationBar';
import SearchResults from '~/components/SearchResults';

import { stationState, IStation } from '~/state/station';
import { lineState } from '~/state/line';
import { search } from '~/state/station/helpers';

interface IProps {
  path?: string;
}

const Search = ({  }: IProps) => {
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

  if (!linesById || !stationsById) {
    return null;
  }

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <>
      <NavigationBar
        onSearchChangeWithValue={setSearchTerm}
        onSearchFocusWithValue={setSearchTerm}
      />
      {resultStations.length ? (
        <SearchResults
          linesById={linesById}
          stations={resultStations}
          onClick={clearSearch}
        />
      ) : null}
    </>
  );
};

export default Search;

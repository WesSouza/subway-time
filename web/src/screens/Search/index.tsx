import * as React from 'react';

import NavigationBar from '~/components/NavigationBar';
import Query, { IQueryResult } from '~/components/Query';
import SearchResults from '~/components/SearchResults';
import StoreValue from '~/components/StoreValue';

import { IStation } from '~/state/station';
import { clearSearch, setSearchTerm } from '~/state/search';
import { searchStations } from '~/state/stations';
import store, { IStore } from '~/state/store';

interface IProps {
  path?: string;
}

const Search = ({  }: IProps) => (
  <>
    <NavigationBar
      onSearchChangeWithValue={setSearchTerm}
      onSearchFocusWithValue={setSearchTerm}
    />
    <StoreValue store={store} property="currentSearchTerm">
      {({ currentSearchTerm }: IStore) =>
        currentSearchTerm ? (
          <Query
            query={searchStations}
            parameters={{ search: currentSearchTerm }}
          >
            {({ data }: IQueryResult<IStation[]>) => (
              <SearchResults stations={data} onClick={clearSearch} />
            )}
          </Query>
        ) : null
      }
    </StoreValue>
  </>
);

export default Search;

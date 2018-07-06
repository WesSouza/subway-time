import * as React from 'react';

import NavigationBar from 'components/NavigationBar';
import Query, { IQueryResult } from 'components/Query';
import SearchResults from 'components/SearchResults';
import StoreValue from 'components/StoreValue';

import { clearSearch, setSearchTerm } from 'data/search';
import { searchStations } from 'data/stations';
import store from 'data/store';
import { IStation } from 'models/models';

interface IProps {
  path?: string;
}

const Search = ({  }: IProps) => (
  <>
    <NavigationBar onSearchChangeWithValue={setSearchTerm} />
    <StoreValue store={store} property="currentSearchTerm">
      {({ currentSearchTerm }: { currentSearchTerm?: string }) =>
        currentSearchTerm ? (
          <Query
            query={searchStations}
            parameters={{ search: currentSearchTerm }}
          >
            {({ data, loading }: IQueryResult<IStation[]>) =>
              !loading && data ? (
                <SearchResults stations={data} onClick={clearSearch} />
              ) : null
            }
          </Query>
        ) : null
      }
    </StoreValue>
  </>
);

export default Search;

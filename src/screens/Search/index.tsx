import * as React from 'react';

import Query from 'components/Query';
import SearchBox from 'components/SearchBox';
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
    <SearchBox onChangeWithValue={setSearchTerm} />
    <StoreValue store={store} property="currentSearchTerm">
      {({ currentSearchTerm }: { currentSearchTerm?: string }) =>
        currentSearchTerm ? (
          <Query
            query={searchStations}
            parameters={{ search: currentSearchTerm }}
            property="stations"
          >
            {({
              loading,
              stations,
            }: {
              loading?: boolean;
              stations?: IStation[];
            }) =>
              !loading && stations ? (
                <SearchResults stations={stations} onClick={clearSearch} />
              ) : null
            }
          </Query>
        ) : null
      }
    </StoreValue>
  </>
);

export default Search;

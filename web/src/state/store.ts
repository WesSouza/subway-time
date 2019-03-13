import Store from '~/lib/store';

export interface IStore {
  currentSearchTerm?: string;
}

const store = new Store<IStore>({
  currentSearchTerm: '',
});

export default store;

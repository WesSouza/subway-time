import store from 'data/store';

export const clearSearch = () => setSearchTerm('');

export const setSearchTerm = (search: string) => {
  store.set({
    currentSearchTerm: search,
  });
};

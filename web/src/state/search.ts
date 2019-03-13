import store from '~/state/store';

export const clearSearch = () => setSearchTerm('');

export const setSearchTerm = (search: string) => {
  store.set({
    currentSearchTerm: search,
  });
};

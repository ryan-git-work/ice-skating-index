/** URL-owned browse state survives detail navigation, reload and browser Back. */
export const browseFilterParams = {
  publicSkating: 'public', freestyle: 'freestyle', rentals: 'rentals', sharpening: 'sharpening',
} as const;

export interface BrowseState {
  searchQuery: string;
  selectedState: string;
  filters: Record<keyof typeof browseFilterParams, boolean>;
}

export function readBrowseState(search: string, states: readonly string[]): BrowseState {
  const params = new URLSearchParams(search);
  const selected = params.get('state')?.toUpperCase() ?? 'all';
  return {
    searchQuery: params.get('q') ?? '',
    selectedState: states.includes(selected) ? selected : 'all',
    filters: Object.fromEntries(Object.entries(browseFilterParams).map(([key, param]) => [key, params.get(param) === '1'])) as BrowseState['filters'],
  };
}

/** Leave unrelated query parameters (such as attribution) intact. */
export function writeBrowseState(search: string, state: BrowseState): string {
  const params = new URLSearchParams(search);
  if (state.searchQuery) params.set('q', state.searchQuery); else params.delete('q');
  if (state.selectedState !== 'all') params.set('state', state.selectedState); else params.delete('state');
  for (const [key, param] of Object.entries(browseFilterParams)) {
    if (state.filters[key as keyof BrowseState['filters']]) params.set(param, '1'); else params.delete(param);
  }
  const query = params.toString();
  return '/browse' + (query ? '?' + query : '');
}

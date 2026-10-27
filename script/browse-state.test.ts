import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readBrowseState, writeBrowseState} from '../client/src/lib/browseState.ts';
const states = ['TN', 'CA'];
test('Shared browse URLs restore query, state and all offering controls', () => {
  assert.deepEqual(readBrowseState('?q=Nashville&state=tn&public=1&freestyle=1&rentals=1&sharpening=1', states), {
    searchQuery: 'Nashville', selectedState: 'TN', filters: {publicSkating:true,freestyle:true,rentals:true,sharpening:true},
  });
});
test('Unknown state and non-boolean filters do not hide the whole directory', () => {
  const state = readBrowseState('state=NOT-A-STATE&public=false&freestyle=yes&rentals=0', states);
  assert.equal(state.selectedState, 'all');
  assert.deepEqual(Object.values(state.filters), [false,false,false,false]);
});
test('Queries with punctuation survive URL encoding and preserve unrelated parameters', () => {
  const state = {...readBrowseState('', states), searchQuery: 'A&B + ice? #1', selectedState: 'CA'};
  const url = writeBrowseState('source=guide', state);
  assert.deepEqual(readBrowseState(url.split('?')[1], states), state);
  assert.equal(new URL('https://example.com'+url).searchParams.get('source'), 'guide');
});
test('Clear filters removes only browse controls', () => {
  assert.equal(writeBrowseState('q=Nashville&state=TN&public=1&freestyle=1&rentals=1&sharpening=1&source=guide',readBrowseState('',states)), '/browse?source=guide');
});

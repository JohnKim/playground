import {List, Map} from 'immutable';

// Loading Entries
export function setEntries(state, entries) {
  return state.set('entries', List(entries));
};

// Starting The Vote
export function next(state) {
  const entries = state.get('entries');

  // https://facebook.github.io/immutable-js/docs/#/Map/merge
  return state.merge({
    vote: Map({pair: entries.take(2)}),
    entries: entries.skip(2)
  });
};

// Voting
export function vote(state, entry) {

  // https://facebook.github.io/immutable-js/docs/#/Map/updateIn
  return state.updateIn(
    ['vote', 'tally', entry],
    0,
    tally => tally + 1
  );
};

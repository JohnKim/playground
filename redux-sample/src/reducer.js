// reducer : takes any kind of action - along with the current state - and invokes the core function that matches the action.

import {setEntries, next, vote, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  // Figure out which function to call and call it

  switch (action.type) {
  case 'SET_ENTRIES':
    return setEntries(state, action.entries);
  case 'NEXT':
    return next(state);
  case 'VOTE':
    return state.update('vote', voteState => vote(voteState, action.entry));
    //return vote(state, action.entry)
  }
  return state;

}

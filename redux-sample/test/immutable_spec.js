

import {expect} from 'chai';
import {List, Map} from 'immutable';

describe('immutability', () => {

  // Numbers are immutable!
  describe('a number', () => {

    function increment(currentState) {
      return currentState + 1;
    }

    it('is immutable', () => {
      let state = 42;
      let nextState = increment(state);

      expect(nextState).to.equal(43);
      expect(state).to.equal(42);
    });

  });


  // With Immutable's Lists
  describe('A List', () => {

    function addMovie(currentState, movie) {
      return currentState.push(movie);
    }

    it('is immutable', () => {
      let state = List.of('Trainspotting', '28 Days Later');
      let nextState = addMovie(state, 'Sunshine');

      console.log('BEFORE : ', state);
      console.log('AFTER  : ', nextState);

      expect(nextState).to.equal(List.of(
        'Trainspotting',
        '28 Days Later',
        'Sunshine'
      ));
      expect(state).to.equal(List.of(
        'Trainspotting',
        '28 Days Later'
      ));
    });

  });


  // data structure of Lists, Maps, and possibly other kinds of collections
  describe('a tree', () => {

    function addMovie(currentState, movie) {
      return currentState.set(
        'movies',
        currentState.get('movies').push(movie)
      );
    }

    it('is immutable', () => {
      let state = Map({
        movies: List.of('Trainspotting', '28 Days Later')
      });
      let nextState = addMovie(state, 'Sunshine');

      console.log('BEFORE : ', state);
      console.log('AFTER  : ', nextState);

      expect(nextState).to.equal(Map({
        movies: List.of(
          'Trainspotting',
          '28 Days Later',
          'Sunshine'
        )
      }));
      expect(state).to.equal(Map({
        movies: List.of(
          'Trainspotting',
          '28 Days Later'
        )
      }));
    });

  });


  describe('a tree (update)', () => {

    let addMovie = (currentState, movie) => {
      // https://facebook.github.io/immutable-js/docs/#/List/update
      return currentState.update('movies', (movies) => {
        return movies.clear().push(movie);
      });
    };

    it('is immutable', () => {
      let state = Map({
        movies: List.of('Trainspotting', '28 Days Later')
      });
      let nextState = addMovie(state, 'Sunshine');

      console.log('BEFORE : ', state);
      console.log('AFTER  : ', nextState);

      expect(nextState).to.equal(Map({
        movies: List.of(
          'Sunshine'
        )
      }));

      expect(state).to.equal(Map({
        movies: List.of(
          'Trainspotting',
          '28 Days Later'
        )
      }));

    });

  });



});

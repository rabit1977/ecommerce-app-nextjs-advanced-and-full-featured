// src/lib/hooks/useLocalStorage.ts

import { useReducer, useEffect, Reducer } from 'react';
import { AppState } from '../types';

// The custom hook that wraps useReducer with localStorage persistence.
export const useLocalStorageReducer = <A,>(
  reducer: Reducer<AppState, A>,
  initialState: AppState,
  storageKey: string
): [AppState, React.Dispatch<A>] => {
  // Initialize state with the default initialState
  const [state, dispatch] = useReducer(reducer, initialState);

  // Use a useEffect to load state from localStorage only on the client
  useEffect(() => {
    try {
      const storedState = localStorage.getItem(storageKey);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        parsedState.wishlist = new Set(parsedState.wishlist);
        dispatch({ type: 'SET_INITIAL_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
  }, [initialState, storageKey]); // Add dependencies

  // Use a second useEffect to save the state to localStorage whenever it changes.
  useEffect(() => {
    try {
      const stateToStore = {
        ...state,
        wishlist: Array.from(state.wishlist),
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToStore));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state, storageKey]);

  return [state, dispatch];
};
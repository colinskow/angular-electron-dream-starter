/*
 * Reducers: this file contains boilerplate code to handle debugging
 * in development mode, implement root state, as well as integrate the store with HMR.
 * Add additional feature state, and reducers in your feature modules.
 */
import { ActionReducer, combineReducers, ActionReducerMap } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import * as fromHome from '../home';

declare const ENV: string;

export interface AppState {
  router: RouterReducerState;
  home: fromHome.HomeState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  home: fromHome.homeReducer
};

// Generate a reducer to set the root state in dev mode for HMR
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action: any) {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

export function logger(reducer: ActionReducer<AppState>): ActionReducer<any, any> {
  return function(state: AppState, action: any): AppState {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: Array<ActionReducer<any, any>> = ENV !== 'production'
  // Dev Reducers
  ? [stateSetter]
  // Prod Reducers
  : [];

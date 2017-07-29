import { Action } from '@ngrx/store';

import * as fromHome from './home.actions';

export interface HomeState {
  value?: string;
}

export const initialState: HomeState = {};

export function homeReducer(state = initialState, action: fromHome.Actions): HomeState {
  switch (action.type) {

    case fromHome.SET_VALUE: {
      return Object.assign({}, state, {
        value: action.payload
      });
    }

    default: {
      return state;
    }
  }
}

import { Action } from '@ngrx/store';

import * as home from './home.actions';

export interface HomeState {
  value?: string;
  computeValue?: number;
  valueComputed?: number;
}

export const initialState: HomeState = {};

export function homeReducer(state = initialState, action: home.Actions): HomeState {
  switch (action.type) {

    case home.SET_VALUE: {
      return Object.assign({}, state, {
        value: action.payload
      });
    }
    case home.ADD_COMPUTE_VALUE: {
      return Object.assign({}, state, {
        computeValue:  action.payload
      });
    }

    case home.VALUE_COMPUTED: {
      return Object.assign({}, state, {
        valueComputed: action.payload
      });
    }

    default: {
      return state;
    }
  }
}

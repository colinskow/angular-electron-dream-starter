import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import * as fromHome from '../home/home.reducer';

export interface AppState {
  router: RouterReducerState;
  home: fromHome.HomeState;
}

export const reducers = {
  router: routerReducer,
  home: fromHome.homeReducer
};

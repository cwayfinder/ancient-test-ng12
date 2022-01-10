import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { RouterState } from './router/router-state';

export interface AppState {
  router: RouterReducerState<RouterState>;
}

export const reducers = {
  router: routerReducer,
};

export const effects = [];

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterState } from './router-state';

export const routerSelector = createFeatureSelector<RouterReducerState<RouterState>>('router');

export const routerStateSelector = createSelector(routerSelector, router => router.state);

export const routeParamsSelector = createSelector(routerStateSelector, state => state.params);
export const routeParamSelector = (name: string) => createSelector(routeParamsSelector, params => params[name]);

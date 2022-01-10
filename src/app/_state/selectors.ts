import { createSelector } from '@ngrx/store';
import { routeParamSelector } from './router/selectors';

export const openBoxInputSelector = createSelector(
  routeParamSelector('boxId'),
  boxId => ({ boxId, amount: 1 }),
);

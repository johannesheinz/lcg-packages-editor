import { createSelector, createFeatureSelector } from '@ngrx/store';

import { selectRouterState, selectPackagesState } from '../core/core.state';
import { packageAdapter } from './packages.reducer';

const {
  selectEntities,
  selectAll,
  selectTotal
} = packageAdapter.getSelectors();

export const selectTotalPackages = createSelector(
  selectPackagesState,
  selectTotal
);

export const selectAllPackages = createSelector(
  selectPackagesState,
  selectAll
);

export const selectPackagesEntities = createSelector(
  selectPackagesState,
  selectEntities
);

export const selectSelectedPackage = createSelector(
  selectPackagesEntities,
  selectRouterState,
  (entities, params) => params && entities[params.state.params.name]
);

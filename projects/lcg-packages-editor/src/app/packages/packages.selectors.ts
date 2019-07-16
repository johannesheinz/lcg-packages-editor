import { createSelector, createFeatureSelector } from '@ngrx/store';

import { selectRouterState, selectPackagesState } from '../core/core.state';
import { packageAdapter } from './packages.reducer';
import { PackageState } from './package.model';

export const selectPackages = createSelector(
  selectPackagesState,
  (state: PackageState) => state
);

const {
  selectEntities,
  selectAll,
  selectTotal
} = packageAdapter.getSelectors();

export const selectTotalPackages = createSelector(
  selectPackages,
  selectTotal
);

export const selectAllPackages = createSelector(
  selectPackages,
  selectAll
);

export const selectPackagesEntities = createSelector(
  selectPackages,
  selectEntities
);

export const selectSelectedPackage = createSelector(
  selectPackagesEntities,
  selectRouterState,
  (entities, params) => {
    console.log('---selectSelectedPackage---');
    console.log(entities);
    console.log(params);
    return params && entities[params.state.params.name];
  }
);

import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Package } from './package.model';

export enum PackageActionTypes {
  UPSERT_ONE = '[Package] Upsert One',
  DELETE_ONE = '[Package] Delete One',
  RETRIEVE = '[Package] Loading ...',
  RETRIEVE_SUCCESS = '[Package] Loading successful',
  RETRIEVE_ERROR = '[Package] Loading failed'
}

export const actionPackageUpsertOne = createAction(
  PackageActionTypes.UPSERT_ONE,
  props<{ pkg: Package }>()
);

export const actionPackageDeleteOne = createAction(
  PackageActionTypes.DELETE_ONE,
  props<{ name: string }>()
);

export const actionPackagesRetrieve = createAction(
  PackageActionTypes.RETRIEVE,
  props<{}>()
);

export const actionPackagesRetrieveSuccess = createAction(
  PackageActionTypes.RETRIEVE_SUCCESS,
  props<{ packages: Package[] }>()
);

export const actionPackagesRetrieveError = createAction(
  PackageActionTypes.RETRIEVE_ERROR,
  props<{ error: HttpErrorResponse }>()
);

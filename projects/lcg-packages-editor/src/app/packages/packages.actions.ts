import { createAction, props } from '@ngrx/store';
import { Package } from './package.model';

export enum PackageActionTypes {
  UPSERT_ONE = '[Package] Upsert One',
  DELETE_ONE = '[Package] Delete One'
}

export const actionPackageUpsertOne = createAction(
  PackageActionTypes.UPSERT_ONE,
  props<{ pkg: Package }>()
);

export const actionPackageDeleteOne = createAction(
  PackageActionTypes.DELETE_ONE,
  props<{ name: string }>()
);

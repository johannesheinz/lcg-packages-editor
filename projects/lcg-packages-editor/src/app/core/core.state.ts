import {
  ActionReducerMap,
  MetaReducer,
  createFeatureSelector
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { environment } from '../../environments/environment';

import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';
import { debug } from './meta-reducers/debug.reducer';
import { RouterStateUrl } from './router/router.state';
import { settingsReducer } from './settings/settings.reducer';
import { SettingsState } from './settings/settings.model';
import { packageReducer } from '../packages/packages.reducer';
import { PackageState } from '../packages/package.model';

export const reducers: ActionReducerMap<AppState> = {
  packages: packageReducer,
  router: routerReducer,
  settings: settingsReducer
};

export const metaReducers: MetaReducer<AppState>[] = [
  initStateFromLocalStorage
];

if (!environment.production) {
  if (!environment.test) {
    metaReducers.unshift(debug);
  }
}

export const selectPackagesState = createFeatureSelector<
  AppState,
  PackageState
>('packages');
export const selectSettingsState = createFeatureSelector<
  AppState,
  SettingsState
>('settings');
export const selectRouterState = createFeatureSelector<
  AppState,
  RouterReducerState<RouterStateUrl>
>('router');

export interface AppState {
  packages: PackageState;
  router: RouterReducerState<RouterStateUrl>;
  settings: SettingsState;
}

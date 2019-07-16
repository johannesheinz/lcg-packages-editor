import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '../core/local-storage/local-storage.service';
import { selectPackagesState } from '../core/core.state';

import { State } from './package.model';
import {
  actionPackageDeleteOne,
  actionPackageUpsertOne
} from './packages.actions';

@Injectable()
export class PackagesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private localStorageService: LocalStorageService
  ) {}

  persistPackages = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actionPackageDeleteOne, actionPackageUpsertOne),
        withLatestFrom(this.store.pipe(select(selectPackagesState))),
        tap(([actions, packagesState]) =>
          this.localStorageService.setItem('PACKAGES', packagesState)
        )
      ),
    { dispatch: false }
  );
}

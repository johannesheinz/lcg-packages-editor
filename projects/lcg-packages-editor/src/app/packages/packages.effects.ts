import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  tap,
  withLatestFrom,
  map,
  catchError,
  debounceTime,
  switchMap
} from 'rxjs/operators';
import { of } from 'rxjs';

import { LocalStorageService } from '../core/local-storage/local-storage.service';
import { selectPackagesState } from '../core/core.state';

import {
  actionPackageDeleteOne,
  actionPackageUpsertOne,
  actionPackagesRetrieve,
  actionPackagesRetrieveSuccess,
  actionPackagesRetrieveError
} from './packages.actions';
import { PackagesService } from './packages.service';
import { State } from './package.model';

@Injectable()
export class PackagesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private service: PackagesService,
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

  retrievePackages = createEffect(() => ({ debounce = 500 } = {}) =>
    this.actions$.pipe(
      ofType(actionPackagesRetrieve),
      tap(packagesState =>
        this.localStorageService.setItem('PACKAGES', packagesState)
      ),
      debounceTime(debounce),
      switchMap(action =>
        this.service.retrievePackages().pipe(
          map(packages => actionPackagesRetrieveSuccess({ packages })),
          catchError(error => of(actionPackagesRetrieveError({ error })))
        )
      )
    )
  );
}

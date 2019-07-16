import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Package, PackageState } from './package.model';
import {
  actionPackageDeleteOne,
  actionPackageUpsertOne,
  actionPackagesRetrieve,
  actionPackagesRetrieveSuccess,
  actionPackagesRetrieveError
} from './packages.actions';
import { Action, createReducer, on } from '@ngrx/store';

import { packages } from './packages.data';

export const packageAdapter: EntityAdapter<Package> = createEntityAdapter<
  Package
>({
  selectId: pkg => pkg.name,
  sortComparer: (pkg_a, pkg_b) => pkg_a.name.localeCompare(pkg_b.name)
});

let blacklist = [
  'none',
  'unknown',
  'uknown',
  'other',
  'various',
  'custom',
  'commercial'
];
let pkg_ids = [];
let pkg_licenses_counting = {};
let pkg_languages = [];
let pkg_categories = [];
let pkg_entities = {};

packages.forEach(pkg => {
  pkg_ids.push(pkg.name);
  if (pkg.license && !blacklist.includes(pkg.license.toLowerCase())) {
    let old: number = pkg_licenses_counting[pkg.license];
    pkg_licenses_counting[pkg.license] = old ? old + 1 : 1;
  }
  if (
    pkg.language &&
    !blacklist.includes(pkg.language.toLowerCase()) &&
    !pkg_languages.includes(pkg.language)
  ) {
    pkg_languages.push(pkg.language);
  }
  if (pkg.category && !pkg_categories.includes(pkg.category)) {
    pkg_categories.push(pkg.category);
  }
  pkg_entities[pkg.name] = pkg;
});

let pkg_licenses = [];

Object.entries(pkg_licenses_counting).forEach(([key, value]) => {
  if (value > 1) {
    pkg_licenses.push(key);
  }
});

// TODO: Read Packages from URL, populate LICENSES preselector and stuff
export const initialState: PackageState = packageAdapter.getInitialState({
  ids: pkg_ids,
  categories: pkg_categories.sort(),
  licenses: pkg_licenses.sort(),
  languages: pkg_languages.sort(),
  entities: pkg_entities
  // entities: {
  //   'foo': {
  //     name: 'foo',
  //     category: 'Kekse',
  //     contacts: [
  //       {
  //         email: 'foo@cem.ch',
  //         name: 'Foo, the Goo'
  //       }
  //     ],
  //     description: 'A random foo package',
  //     fullname: 'FoO',
  //     homepage: 'http://foo.com',
  //     language: 'Python',
  //     license: 'MIT'
  //   }
  // }

  // ids: ['123'],
  // entities: {
  //   '123': {
  //     id: '123',
  //     title: 'Reactive Programming with Angular and ngrx',
  //     author: 'Oren Farhi',
  //     description:
  //     'Learn to Harness the Power of Reactive Programming with RxJS and ngrx Extensions'
  //   }
  // }
});

const reducer = createReducer(
  initialState,
  on(actionPackageUpsertOne, (state, { pkg }) =>
    packageAdapter.upsertOne(pkg, state)
  ),
  on(actionPackageDeleteOne, (state, { name }) =>
    packageAdapter.removeOne(name, state)
  )
);

export function packageReducer(
  state: PackageState | undefined,
  action: Action
) {
  return reducer(state, action);
}

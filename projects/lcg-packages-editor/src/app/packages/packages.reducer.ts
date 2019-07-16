import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Package, PackageState } from './package.model';
import {
  actionPackageDeleteOne,
  actionPackageUpsertOne
} from './packages.actions';
import { Action, createReducer, on } from '@ngrx/store';

export const packageAdapter: EntityAdapter<Package> = createEntityAdapter<
  Package
>({
  selectId: pkg => pkg.name,
  sortComparer: (pkg_a, pkg_b) => pkg_a.name.localeCompare(pkg_b.name)
});

// TODO: Read Packages from URL, populate LICENSES preselector and stuff
export const initialState: PackageState = packageAdapter.getInitialState({
  ids: ['lcg_packages_editor'],
  entities: {
    lcg_packages_editor: {
      name: 'lcg_packages_editor',
      category: 'Tool',
      contacts: [
        {
          email: 'https://github.com/johannesheinz',
          name: 'Johannes Heinz'
        }
      ],
      description: 'lcg_packages_editor',
      fullname: 'LCG Packages Editor',
      homepage: 'https://github.com/johannesheinz/lcg-packages-editor',
      language: 'TypeScript',
      license: 'MIT'
    }
  }
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

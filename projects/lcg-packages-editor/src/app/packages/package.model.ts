import { EntityState } from '@ngrx/entity';
import { AppState } from '../core/core.module';

export interface Contact {
  email: string;
  name: string;
}

export interface Package {
  category: string;
  contacts: Contact[];
  description: string;
  fullname: string;
  homepage: string;
  language: string;
  license: string;
  name: string;
}

export function isPackageValid(): boolean {
  return true;
}

export interface PackageState extends EntityState<Package> {}

export interface State extends AppState {
  packages: PackageState;
}

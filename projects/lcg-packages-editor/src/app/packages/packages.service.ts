import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Package } from './package.model';

export const PACKAGES_URL =
  'https://gitlab.cern.ch/sft/lcgcmake/raw/master/documentation/packages.json';

@Injectable({
  providedIn: 'root'
})
export class PackagesService {
  constructor(private http: HttpClient) {}

  retrievePackages(): Observable<Package[]> {
    return this.http.get<Package[]>(PACKAGES_URL);
  }
}

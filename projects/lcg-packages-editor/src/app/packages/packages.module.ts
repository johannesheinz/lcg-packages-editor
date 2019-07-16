import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SharedModule } from '../shared/shared.module';
import { environment } from '../../environments/environment';
import { reducers } from '../core/core.state';

import { PackageListComponent } from './package-list/package-list.component';
import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesEffects } from './packages.effects';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/examples/`,
    '.json'
  );
}

@NgModule({
  declarations: [PackageListComponent],
  imports: [
    CommonModule,
    SharedModule,
    PackagesRoutingModule,
    MatAutocompleteModule,
    StoreModule.forFeature('packages', reducers),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    EffectsModule.forFeature([PackagesEffects])
  ]
})
export class PackagesModule {}

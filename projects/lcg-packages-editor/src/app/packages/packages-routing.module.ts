import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackageListComponent } from './package-list/package-list.component';

const routes: Routes = [
  {
    path: '',
    component: PackageListComponent,
    data: { title: 'anms.examples.menu.crud' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesRoutingModule {}

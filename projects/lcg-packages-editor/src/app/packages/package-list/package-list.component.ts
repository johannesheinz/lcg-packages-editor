import { Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { LocalStorageService } from '../../core/local-storage/local-storage.service';

import { AppState, ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';

import {
  ActionSettingsChangeAnimationsElements,
  ActionSettingsChangeAnimationsPage,
  ActionSettingsChangeAutoNightMode,
  ActionSettingsChangeLanguage,
  ActionSettingsChangeTheme,
  ActionSettingsChangeStickyHeader
} from '../../core/settings/settings.actions';

import { Contact, Package } from '../package.model';
import {
  actionPackageDeleteOne,
  actionPackageUpsertOne
} from '../packages.actions';
import {
  selectSelectedPackage,
  selectAllPackages,
  selectTotalPackages
} from '../packages.selectors';

@Component({
  selector: 'anms-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageListComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  // TODO: packages: Package[] = packages;

  // TODO: Fill automatically

  filteredCategories: Observable<string[]>;
  // = [ "C++", "Fortran", "Java", "Perl", "Python", "R" ]
  filteredLanguages: Observable<string[]>;
  // = [ "Apache", "Apache 2.0", "Apache License 2.0", "BSD", "BSD 3-Clause License", "GPL", "GPL2", "GPLv2", "GPLv3", "GPLv3+", "LCGAA", "LGPL", "LLVM", "MIT", "Python" ]
  filteredLicenses: Observable<string[]>;

  packageCount$: Observable<number>;
  packages$: Observable<Package[]>;
  selectedPackage$: Observable<Package>;

  packageFormGroup = this.fb.group(PackageListComponent.createPackage());
  isEditing: boolean;
  selectedPackageName: string;

  displayOnlyIncompletePackages: boolean = false;

  // TODO: Make sure that the name is unique.
  static createPackage(package_name = 'new_package'): Package {
    return {
      name: package_name,
      category: '',
      contacts: [
        {
          email: '',
          name: ''
        }
      ],
      description: '',
      fullname: '',
      homepage: '',
      language: '',
      license: ''
    };
  }

  constructor(
    public fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private localStorage: LocalStorageService,
    public store: Store<AppState>
  ) {}

  ngOnInit() {
    // Set default settings
    this.store.dispatch(new ActionSettingsChangeLanguage({ language: 'en' }));
    this.store.dispatch(
      new ActionSettingsChangeTheme({ theme: 'DEFAULT-THEME' })
    ); // 'BLACK-THEME'
    this.store.dispatch(
      new ActionSettingsChangeAutoNightMode({ autoNightMode: false })
    );
    this.store.dispatch(
      new ActionSettingsChangeStickyHeader({ stickyHeader: true })
    );
    this.store.dispatch(
      new ActionSettingsChangeAnimationsPage({ pageAnimations: true })
    );
    this.store.dispatch(
      new ActionSettingsChangeAnimationsElements({ elementsAnimations: true })
    );

    // TODO: Call _generateDownload(packages)

    let pkges = [];
    pkges.push(PackageListComponent.createPackage('bar'));
    pkges.push(PackageListComponent.createPackage('keks'));
    pkges.push(PackageListComponent.createPackage('foo'));
    this._generateDownload(pkges);

    this.store.dispatch(actionPackagesRetrieve({}));

    this.packages$ = this.store.pipe(select(selectAllPackages));
    this.packageCount$ = this.store.pipe(select(selectTotalPackages));
    this.selectedPackage$ = this.store.pipe(select(selectSelectedPackage));

    this.packages$.subscribe(packages => this._reloadPackages());

    // Autofill setup
    const categories: Array<string> = this.localStorage.getItem('PACKAGES')[
      'categories'
    ];
    const languages: Array<string> = this.localStorage.getItem('PACKAGES')[
      'languages'
    ];
    const licenses: Array<string> = this.localStorage.getItem('PACKAGES')[
      'licenses'
    ];

    this.filteredCategories = this.packageFormGroup
      .get('category')
      .valueChanges.pipe(
        startWith(''),
        map(value => {
          const filterValue = value ? value.toLowerCase() : '';
          return categories.filter(option =>
            option.toLowerCase().includes(filterValue)
          );
        })
      );

    this.filteredLanguages = this.packageFormGroup
      .get('language')
      .valueChanges.pipe(
        startWith(''),
        map(value => {
          const filterValue = value ? value.toLowerCase() : '';
          return languages.filter(option =>
            option.toLowerCase().includes(filterValue)
          );
        })
      );
    this.filteredLicenses = this.packageFormGroup
      .get('license')
      .valueChanges.pipe(
        startWith(''),
        map(value => {
          const filterValue = value ? value.toLowerCase() : '';
          return licenses.filter(option =>
            option.toLowerCase().includes(filterValue)
          );
        })
      );
  }
  private _reloadPackages() {
    // TODO: Delete LocalStorage
    this.store.dispatch(actionPackagesRetrieve({}));
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  select(pkg: Package) {
    this.isEditing = false;
    this.selectedPackageName = pkg.name;
    this.router.navigate(['packages', pkg.name]);
  }

  deselect() {
    this.isEditing = false;
    this.selectedPackageName = '';
    this.router.navigate(['packages']);
  }

  edit(pkg: Package) {
    this.isEditing = true;
    this.selectedPackageName = pkg.name;
    this.packageFormGroup.setValue(pkg);
  }

  addNew(packageForm: NgForm) {
    packageForm.resetForm();
    this.packageFormGroup.reset();
    this.packageFormGroup.setValue(PackageListComponent.createPackage());
    this.isEditing = true;
    this.selectedPackageName = '';
  }

  cancelEditing() {
    this.isEditing = false;
  }

  delete(pkg: Package) {
    this.store.dispatch(actionPackageDeleteOne({ name: pkg.name }));
    this.isEditing = false;
    this.selectedPackageName = '';
    this.router.navigate(['packages']);
  }

  save() {
    if (this.packageFormGroup.valid) {
      const pkg = this.packageFormGroup.value;
      this.store.dispatch(actionPackageUpsertOne({ pkg }));
      this.isEditing = false;
      this.selectedPackageName = '';
      this.router.navigate(['packages', pkg.name]);
    }
  }

  onDisplayOnlyIncompletePackagesToggle(event) {
    return false;
  }

  isIncomplete(pkg: Package): boolean {
    return !(
      pkg.name &&
      pkg.fullname &&
      pkg.category &&
      pkg.description &&
      pkg.homepage &&
      pkg.license &&
      pkg.language &&
      pkg.contacts.length > 0
    );
  }

  selectedFile: File;

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, 'UTF-8');

    fileReader.onload = () => {
      console.log('hello');
      console.log(JSON.parse(fileReader.result.toString()));
    };

    fileReader.onerror = error => {
      console.log(error);
    };
  }

  downloadHref: SafeUrl;

  private _generateDownload(packages: Package[]) {
    this.downloadHref = this.sanitizer.bypassSecurityTrustUrl(
      'data:text/json;charset=UTF-8,' +
        encodeURIComponent(JSON.stringify(packages))
    );
    console.log('cheers');
    console.log(this.downloadHref);
  }
}

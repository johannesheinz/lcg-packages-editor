import { Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { LocalStorageService } from '../../core/local-storage/local-storage.service';

import { ROUTE_ANIMATIONS_ELEMENTS, AppState } from '../../core/core.module';

import {
  ActionSettingsChangeAnimationsElements,
  ActionSettingsChangeAnimationsPage,
  ActionSettingsChangeAutoNightMode,
  ActionSettingsChangeLanguage,
  ActionSettingsChangeTheme,
  ActionSettingsChangeStickyHeader
} from '../../core/settings/settings.actions';

import { Contact, Package, PackageState } from '../package.model';
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

  downloadHref: SafeUrl;
  uploadedFile: File;

  // Autofill setup
  categories: Array<string> = [];
  languages: Array<string> = [];
  licenses: Array<string> = [];

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

    // TODO: Create subscription for _generateDownload(packages)

    this.packages$ = this.store.pipe(select(selectAllPackages));
    this.packageCount$ = this.store.pipe(select(selectTotalPackages));
    this.selectedPackage$ = this.store.pipe(select(selectSelectedPackage));
  }

  private _addPackage(pkg: Package, licenses_counting: Map<string, number>) {
    const blacklist = [
      'none',
      'unknown',
      'uknown',
      'other',
      'various',
      'custom',
      'commercial'
    ];

    if (pkg.category && !this.categories.includes(pkg.category)) {
      this.categories.push(pkg.category);
    }

    if (
      pkg.language &&
      !blacklist.includes(pkg.language.toLowerCase()) &&
      !this.languages.includes(pkg.language)
    ) {
      this.languages.push(pkg.language);
    }

    if (pkg.license && !blacklist.includes(pkg.license.toLowerCase())) {
      let old: number = licenses_counting[pkg.license];
      licenses_counting[pkg.license] = old ? old + 1 : 1;
    }

    this.store.dispatch(actionPackageUpsertOne({ pkg }));
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

  onFileChanged(event) {
    this.uploadedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.uploadedFile, 'UTF-8');

    fileReader.onload = () => {
      // Parse result
      const packages: Array<Package> = JSON.parse(fileReader.result.toString());

      // Add new packages to local storage
      let licenses_counting: Map<string, number> = new Map<string, number>();
      packages.forEach(pkg => this._addPackage(pkg, licenses_counting));

      // Clean licenses
      Object.entries(licenses_counting).forEach(([key, value]) => {
        if (value > 1) {
          this.licenses.push(key);
        }
      });

      // Generate initial download link
      this._generateDownload(packages);

      // Sort proposal arrays
      this.categories = this.categories.sort();
      this.languages = this.languages.sort();
      this.licenses = this.licenses.sort();

      // Setup auto-fill
      this.filteredCategories = this._filter('category', this.categories);
      this.filteredLanguages = this._filter('language', this.languages);
      this.filteredLicenses = this._filter('license', this.licenses);
    };
    fileReader.onerror = error => {
      console.log(error);
    };
  }

  private _filter(input: string, collection: Array<string>) {
    return this.packageFormGroup.get(input).valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = value ? value.toLowerCase() : '';
        return collection.filter(option =>
          option.toLowerCase().includes(filterValue)
        );
      })
    );
  }

  private _generateDownload(packages: Package[]) {
    this.downloadHref = this.sanitizer.bypassSecurityTrustUrl(
      'data:text/json;charset=UTF-8,' +
        encodeURIComponent(JSON.stringify(packages))
    );
  }
}

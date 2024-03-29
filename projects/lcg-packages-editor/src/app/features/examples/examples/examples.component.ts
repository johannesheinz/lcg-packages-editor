import { Store, select } from '@ngrx/store';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { routeAnimations } from '../../../core/core.module';
import { State } from '../examples.state';

@Component({
  selector: 'anms-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent {
  examples = [
    { link: 'todos', label: 'anms.examples.menu.todos' },
    { link: 'stock-market', label: 'anms.examples.menu.stocks' },
    { link: 'theming', label: 'anms.examples.menu.theming' },
    { link: 'crud', label: 'anms.examples.menu.crud' },
    {
      link: 'simple-state-management',
      label: 'anms.examples.menu.simple-state-management'
    },
    { link: 'form', label: 'anms.examples.menu.form' },
    { link: 'notifications', label: 'anms.examples.menu.notifications' }
  ];
}

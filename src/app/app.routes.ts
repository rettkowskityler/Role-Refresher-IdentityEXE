import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/role-refresher/role-refresher.component').then(
        (m) => m.RoleRefresherComponent
      ),
  },
  {
    path: 'role-refresher',
    loadComponent: () =>
      import('./features/role-refresher/role-refresher.component').then(
        (m) => m.RoleRefresherComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

import { Routes } from '@angular/router';
import { Hero } from './Components/hero/hero/hero';

export const routes: Routes = [

    {
    path: '',
    component: Hero
  },

  {
    path: '**',
    redirectTo: ''
  }
];

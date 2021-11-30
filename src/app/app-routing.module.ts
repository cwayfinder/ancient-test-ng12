import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'boxes',
    loadChildren: () => import('./boxes/boxes.module').then(m => m.BoxesModule),
  },
  { path: '**', redirectTo: '/boxes', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

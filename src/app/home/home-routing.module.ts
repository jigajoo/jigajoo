import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
    {
      path: 'insight',
      loadChildren: () => import('../insight/insight.module').then( m => m.InsightPageModule)
    },
    {
      path: 'mappoint',
      loadChildren: () => import('../mappoint/mappoint.module').then( m => m.MappointPageModule)
    },
    {
      path: 'match',
      loadChildren: () => import('../match/match.module').then( m => m.MatchPageModule)
    },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}

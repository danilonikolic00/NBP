import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForyouComponent } from './foryou/foryou.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'foryou', component: ForyouComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'search', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

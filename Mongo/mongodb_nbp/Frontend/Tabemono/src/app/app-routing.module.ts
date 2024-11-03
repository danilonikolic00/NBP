import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { HomepageComponent } from './homepage/homepage.component';
import { KaterogijePanelComponent } from './katerogije-panel/katerogije-panel.component';
import { LoginComponent } from './login/login.component';
import { ProdavnicaComponent } from './prodavnica/prodavnica.component';
import { ProfilComponent } from './profil/profil.component';
import { RestoraniPanelComponent } from './restorani-panel/restorani-panel.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomepageComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'prodavnica', component: ProdavnicaComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'kategorije-panel', component: KaterogijePanelComponent },
  { path: 'restorani-panel', component: RestoraniPanelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

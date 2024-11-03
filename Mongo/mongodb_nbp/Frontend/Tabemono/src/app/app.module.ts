import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { HomepageComponent } from './homepage/homepage.component';
import { ProfilComponent } from './profil/profil.component';
import { ProdavnicaComponent } from './prodavnica/prodavnica.component';
import { ProizvodDialogComponent } from './proizvod-dialog/proizvod-dialog.component';
import { KorpaDialogComponent } from './korpa-dialog/korpa-dialog.component';
import { RateDialogComponent } from './rate-dialog/rate-dialog.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { KaterogijePanelComponent } from './katerogije-panel/katerogije-panel.component';
import { RestoraniPanelComponent } from './restorani-panel/restorani-panel.component';
import { KategorijaDialogComponent } from './kategorija-dialog/kategorija-dialog.component';
import { RestoranDialogComponent } from './restoran-dialog/restoran-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { ZeroPageComponent } from './zero-page/zero-page.component';
import { KorisnikService } from './services/korisnik.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { KategorijaService } from './services/kategorija.service';
import { ProizvodAddDialogComponent } from './proizvod-add-dialog/proizvod-add-dialog.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { UploadComponent } from './upload/upload.component';
import { NarudzbinaDialogComponent } from './narudzbina-dialog/narudzbina-dialog.component';
import { EditProizvodDialogComponent } from './edit-proizvod-dialog/edit-proizvod-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    ProfilComponent,
    ProdavnicaComponent,
    ProizvodDialogComponent,
    KorpaDialogComponent,
    RateDialogComponent,
    AdminPanelComponent,
    KaterogijePanelComponent,
    RestoraniPanelComponent,
    KategorijaDialogComponent,
    RestoranDialogComponent,
    ZeroPageComponent,
    ProizvodAddDialogComponent,
    SearchDialogComponent,
    UploadComponent,
    EditProizvodDialogComponent,
    NarudzbinaDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [KorisnikService, CookieService, KategorijaService],
  bootstrap: [AppComponent],
})
export class AppModule {}

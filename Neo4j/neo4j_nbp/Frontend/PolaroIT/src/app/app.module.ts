import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfilComponent } from './profil/profil.component';
import { ForyouComponent } from './foryou/foryou.component';
import { SearchComponent } from './search/search.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { UploadComponent } from './upload/upload.component';
import { UserlistDialogComponent } from './userlist-dialog/userlist-dialog.component';
import { MentionDialogComponent } from './mention-dialog/mention-dialog.component';
import { UploadProfilComponent } from './upload-profil/upload-profil.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    ProfilComponent,
    ForyouComponent,
    SearchComponent,
    ProfileDialogComponent,
    UploadComponent,
    UserlistDialogComponent,
    MentionDialogComponent,
    UploadProfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

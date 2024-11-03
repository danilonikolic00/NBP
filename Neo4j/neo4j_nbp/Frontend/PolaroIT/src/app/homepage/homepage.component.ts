import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  constructor(
    private korisnikservice: KorisnikService,
    private cookie: CookieService,
    private router: Router
  ) {}
  public page: string = 'foryou';
  public profilna: string = '';

  ngOnInit() {}

  logout() {
    this.korisnikservice.logout().subscribe(() => {
      this.cookie.deleteAll();
      window.location.reload();
    });
  }

  promeniPage(newPage: string) {
    this.page = newPage;
  }
  clickProfil() {
    var korisnik = this.cookie.get('LoggedIn');
    this.cookie.set('UserProfile', korisnik);
    this.promeniPage('profil');
  }

  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  };
}

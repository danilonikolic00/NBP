import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserType } from 'src/enums/enums';
import { KorisnikService } from './services/korisnik.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Tabemono';
  public ruta: string = '';
  constructor(
    private router: Router,
    private cookie: CookieService,
    private korisnikService: KorisnikService
  ) {}
  ngOnInit() {
    let email = this.cookie.get('UserID');
    if (email != '') {
      let tip: UserType;
      this.korisnikService.VratiTip().subscribe((UserTip) => {
        tip = UserTip;
        if (tip != 0 && tip != 2) this.ruta = 'home';
        else if (tip == 2) this.ruta = 'admin-panel';
      });
    } else this.ruta = 'login';

    this.korisnikService.registerAdmin().subscribe();
  }
}

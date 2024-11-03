import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent {
  constructor(
    private router: Router,
    private cookie: CookieService,
    private korisnikService: KorisnikService
  ) {}
  ngOnInit() {
    this.router.navigate(['']);
  }

  openRestorani() {
    this.router.navigate(['restorani-panel']);
  }

  openKategorije() {
    this.router.navigate(['kategorije-panel']);
  }

  logout() {
    this.cookie.deleteAll();
    window.location.reload();
    this.korisnikService.logout();
  }
}

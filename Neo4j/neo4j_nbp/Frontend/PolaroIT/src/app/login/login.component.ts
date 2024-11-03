import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Korisnik } from '../models/korisnik';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private korisnikservis: KorisnikService,
    private ruta: Router,
    private cookie: CookieService
  ) {}
  public CurrentKorisnik!: Korisnik;
  public mode: boolean = false; // login-false | register-true
  ngOnInit() {
    this.CurrentKorisnik = {
      ime: '',
      prezime: '',
      rodjedan: '',
      korisnicko_ime: '',
      lozinka: '',
      email: '',
      online: false,
      drzava: '',
      profilnaSlika:''
    };
  }
  register() {
    this.korisnikservis.register(this.CurrentKorisnik).subscribe((result) => {
      if (result) {
        this.CurrentKorisnik = {
          ime: '',
          prezime: '',
          rodjedan: '',
          korisnicko_ime: '',
          lozinka: '',
          email: '',
          online: false,
          drzava: '',
          profilnaSlika:''
        };
        this.PromeniMod();
      }
    });
  }

  login() {
    this.korisnikservis
      .login(this.CurrentKorisnik.korisnicko_ime, this.CurrentKorisnik.lozinka)
      .subscribe((result) => {
        if (result) {
          window.location.reload();
          this.cookie.set('LoggedIn', this.CurrentKorisnik.korisnicko_ime);
        }
      });
  }
  PromeniMod() {
    this.CurrentKorisnik = {
      ime: '',
      prezime: '',
      rodjedan: '',
      korisnicko_ime: '',
      lozinka: '',
      email: '',
      online: false,
      drzava: '',
      profilnaSlika:''
    };

    this.mode = !this.mode;
  }
}

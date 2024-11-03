import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginMode } from 'src/enums/enums';
import { korisnik } from 'src/models/Korisnik';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private mode: LoginMode;
  constructor(
    private cookie: CookieService,
    private router: Router,
    private korisnikService: KorisnikService
  ) {
    this.mode = LoginMode.login;
  }
  ngOnInit() {}

  ChangeMode() {
    if (this.mode == LoginMode.login) this.mode = LoginMode.register;
    else this.mode = LoginMode.login;
  }

  GetMode() {
    return this.mode;
  }

  register(
    ime: string,
    prezime: string,
    email: string,
    password: string,
    passwordcheck: string,
    broj: string
  ) {
    if (
      ime.length > 0 &&
      prezime.length > 0 &&
      email.length > 0 &&
      broj.length > 0 &&
      password.length > 0
    )
      if (password == passwordcheck) {
        let Novi: korisnik = {
          id: '',
          id_string: '',
          ime: ime,
          prezime: prezime,
          email: email,
          lozinka: password,
          tip: '',
          online: false,
          broj_telefona: broj,
        };
        this.korisnikService.register(Novi).subscribe((rezultat) => {
          if (rezultat) this.ChangeMode();
          else alert('Uneti email se vec koristi !');
        });
      }
  }

  login(email: string, password: string) {
    this.korisnikService.login(email, password).subscribe((loginResult) => {
      this.cookie.set('UserID', loginResult);
      window.location.reload();
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserType } from 'src/enums/enums';
import { kategorija } from 'src/models/Kategorija';
import { korisnik } from 'src/models/Korisnik';
import { narudzbina } from 'src/models/Narudzbina';
import { prodavnica } from 'src/models/Prodavnica';
import { proizvod } from 'src/models/Proizvod';

@Injectable({
  providedIn: 'root',
})
export class KorisnikService {
  private readonly URL = 'https://localhost:5001/';

  constructor(private http: HttpClient, private cookie: CookieService) {}

  login(email: string, lozinka: string) {
    return this.http.put<string>(
      this.URL + `api/Tabemono/login/${email}/${lozinka}`,
      {
        dataType: 'text',
      }
    );
  }

  logout() {
    return this.http.put(
      this.URL + `api/Tabemono/logout/${this.cookie.get('UserID')}`,
      {
        responseType: 'text',
      }
    );
  }

  register(Novi: korisnik) {
    return this.http.post<boolean>(
      this.URL +
        `api/Tabemono/Registracija/${Novi.ime}/${Novi.prezime}/${Novi.email}/${Novi.lozinka}/${Novi.broj_telefona}`,
      Novi
    );
  }

  VratiTip() {
    return this.http.get<UserType>(
      this.URL + `api/Tabemono/VratiTip/${this.cookie.get('UserID')}`
    );
  }

  GetKlijent() {
    return this.http.get<korisnik>(
      this.URL + `api/Tabemono/GetProfilKlijenta/${this.cookie.get('UserID')}`
    );
  }

  GetAllNaruzdbine() {
    return this.http.get<narudzbina[]>(
      this.URL +
        `api/Tabemono/vratiNarudzbineKlijenta/${this.cookie.get('UserID')}`
    );
  }

  IzmeniKlijent(Novi: korisnik) {
    return this.http.post<boolean>(
      this.URL +
        `api/Tabemono/IzmeniProfil/${this.cookie.get('UserID')}/${Novi.ime}/${
          Novi.prezime
        }/${Novi.lozinka}/${Novi.broj_telefona}`,
      Novi
    );
  }

  IzmeniShop(Novi: prodavnica) {
    return this.http.put<boolean>(
      this.URL +
        `api/Tabemono/IzmeniProfilShop/${this.cookie.get('UserID')}/${
          Novi.ime
        }/${Novi.broj_telefona}/${Novi.adresa}/${Novi.lozinka}/${
          Novi.kategorija_ime
        }`,
      Novi
    );
  }

  nadjiProdavnicu(ime: string) {
    return this.http.get<prodavnica[]>(
      this.URL + `api/Tabemono/SearchProdavnica/${ime}`
    );
  }

  vratiProdavnice() {
    return this.http.get<prodavnica[]>(
      this.URL + `api/Tabemono/VratiSveProdavnice`
    );
  }
  obrisiProdavnicu(id: string) {
    return this.http.delete(this.URL + `api/Tabemono/ObrisiProdavnicu/${id}`);
  }
  vratiProizvode(id: string) {
    return this.http.get<proizvod[]>(
      this.URL + `api/Tabemono/vratiProizvode/${id}`
    );
  }

  registerAdmin() {
    return this.http.post(
      this.URL + `api/Tabemono/RegisterAdmin/admin@gmail.com/admin`,
      {}
    );
  }
}

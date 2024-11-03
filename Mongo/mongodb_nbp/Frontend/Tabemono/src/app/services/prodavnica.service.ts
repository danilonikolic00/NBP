import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { narudzbina } from 'src/models/Narudzbina';
import { prodavnica } from 'src/models/Prodavnica';
import { proizvod } from 'src/models/Proizvod';

@Injectable({
  providedIn: 'root',
})
export class ProdavnicaService {
  private readonly URL = 'https://localhost:5001/';

  constructor(private http: HttpClient, private cookie: CookieService) {}

  Create(nova: prodavnica) {
    return this.http.post<boolean>(
      this.URL +
        `api/Tabemono/DodajProdavnicu/${nova.ime}/${nova.email}/${nova.adresa}/${nova.broj_telefona}/${nova.lozinka}/${nova.string_kategorija}`,
      {}
    );
  }

  GetProdavnica() {
    return this.http.get<prodavnica>(
      this.URL + `api/Tabemono/GetProfilProdavnice/${this.cookie.get('UserID')}`
    );
  }

  vratiProdavnica(id: string) {
    return this.http.get<prodavnica>(
      this.URL + `api/Tabemono/GetProfilProdavnice/${id}`
    );
  }

  GetAllProizvodi() {
    return this.http.get<proizvod[]>(
      this.URL + `api/Tabemono/vratiProizvode/${this.cookie.get('UserID')}`
    );
  }

  AddProizvod(nova: proizvod) {
    return this.http.post<string>(
      this.URL +
        `api/Tabemono/DodajProizvod/${nova.ime}/${nova.cena}/${nova.opis}/${
          nova.kategorija
        }/${this.cookie.get('UserID')}`,
      {}
    );
  }

  IzmeniProizvod(Novi: proizvod) {
    return this.http.put<boolean>(
      this.URL +
        `api/Tabemono/IzmeniProizvod/${Novi.ime}/${Novi.cena}/${Novi.opis}/${Novi.dostupnost}/${Novi.kategorija}/${Novi.id_string}`,
      Novi
    );
  }

  DeleteProizvod(id: string) {
    return this.http.delete<string>(
      this.URL + `api/Tabemono/ObrisiProizvod/${id}`,
      {}
    );
  }

  getProdavnicePoKategoriji(ime: string) {
    return this.http.get<prodavnica[]>(
      this.URL + `api/Tabemono/SearchProdavnicaKategorija/${ime}`
    );
  }

  dodajProizvodUKorpu(id_proizvoda: string) {
    return this.http.put(
      this.URL +
        `api/Tabemono/DodajProizvodUKorpu/${id_proizvoda}/${this.cookie.get(
          'UserID'
        )}`,
      {}
    );
  }

  izbaciProizvodIzKorpe(id_proizvoda: string) {
    return this.http.delete(
      this.URL +
        `api/Tabemono/IzbaciProizvodIzKorpe/${id_proizvoda}/${this.cookie.get(
          'UserID'
        )}`
    );
  }

  vratiProizvodeUKorpi() {
    return this.http.get<proizvod[]>(
      this.URL +
        `api/Tabemono/vratiProizvodeUKorpi/${this.cookie.get('UserID')}`
    );
  }

  poruci() {
    return this.http.post<narudzbina>(
      this.URL + `api/Tabemono/Poruci/${this.cookie.get('UserID')}`,
      {}
    );
  }

  Oceni(id: string, ocena: number) {
    return this.http.put(
      this.URL +
        `api/Tabemono/OceniProdavnicu/${id}/${ocena}/${this.cookie.get(
          'UserID'
        )}`,
      {}
    );
  }
}

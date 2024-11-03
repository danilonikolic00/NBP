import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { kategorija } from 'src/models/Kategorija';
import ObjectID from 'bson-objectid';
@Injectable({
  providedIn: 'root',
})
export class KategorijaService {
  private readonly URL = 'https://localhost:5001/';

  constructor(private http: HttpClient, private cookie: CookieService) {}

  CreateKategorija(nova: kategorija) {
    return this.http.post(
      this.URL + `api/Tabemono/DodajKategoriju/${nova.ime}`,
      {}
    );
  }

  GetAll() {
    return this.http.get<kategorija[]>(
      this.URL + `api/Tabemono/VratiKategorije`
    );
  }

  Delete(id: string) {
    console.log(id);
    return this.http.delete(this.URL + `api/Tabemono/ObrisiKategoriju/${id}`, {
      responseType: 'text',
    });
  }
  nadjiKategoriju(ime: string) {
    return this.http.get<kategorija[]>(
      this.URL + `api/Tabemono/SearchKategorija/${ime}`
    );
  }

  VratiKategoriju() {
    return this.http.get<kategorija>(
      this.URL + `api/Tabemono/VratiKategoriju/${this.cookie.get('UserID')}`
    );
  }
}

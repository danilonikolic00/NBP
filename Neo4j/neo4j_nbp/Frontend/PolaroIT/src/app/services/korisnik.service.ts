import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Korisnik } from '../models/korisnik';
import { CookieService } from 'ngx-cookie-service';
import { Tag } from '../models/tag';
import { Drzava } from '../models/drzava';
import { Slika } from '../models/slika';
import { Preference } from '../models/preference';
import { Like } from '../models/like';
import { Komentar } from '../models/komentar';
import { Mentions } from '../models/mention';

@Injectable({
  providedIn: 'root',
})
export class KorisnikService {
  constructor(private http: HttpClient, private cookie: CookieService) {}
  private readonly URL = 'https://localhost:5001/';
  login(korisnicko_ime: string, lozinka: string) {
    return this.http.put(
      this.URL + `api/Korisnik/login/${korisnicko_ime}/${lozinka}`,
      { responseType: 'text' }
    );
  }

  register(Korisnik: Korisnik) {
    return this.http.post(
      this.URL +
        `api/Korisnik/register/${Korisnik.ime}/${Korisnik.prezime}/${Korisnik.rodjedan}/${Korisnik.korisnicko_ime}/${Korisnik.lozinka}/${Korisnik.email}/${Korisnik.drzava}`,
      { responseType: 'text' }
    );
  }

  logout() {
    return this.http.put(
      this.URL + `api/Korisnik/logout/${this.cookie.get('LoggedIn')}`,
      { responseType: 'text' }
    );
  }

  GetProfilna() {
    return this.http.get<Korisnik>(
      this.URL + `api/Korisnik/GetProfilnaSlika/${this.cookie.get('LoggedIn')}`
    );
  }

  getKorisnik(korisnicko_ime: string) {
    return this.http.get<Korisnik>(
      this.URL + `api/Korisnik/PreuzmiKorisnika/${korisnicko_ime}`
    );
  }
  changeKorisnik(
    korisnicko_ime: string,
    ime: string,
    prezime: string,
    rodjedan: string,
    email: string
  ) {
    return this.http.put<Korisnik>(
      this.URL +
        `api/Korisnik/changeUserInfo/${korisnicko_ime}/${ime}/${prezime}/${rodjedan}/${email}`,
      { responseType: 'text' }
    );
  }
  changePreference(korisnicko_ime: string, tagovi: string, drzava: string) {
    return this.http.put<Preference>(
      this.URL +
        `api/Korisnik/changePreferences/${korisnicko_ime}/${tagovi}/${drzava}`,
      { responseType: 'text' }
    );
  }
  changePhotoInfo(lokacija: string, tagovi: string) {
    var l = lokacija.replaceAll('\\', '$@$');
    return this.http.put<Preference>(
      this.URL + `api/Korisnik/changePicInfo/${l}/${tagovi}`,
      { responseType: 'text' }
    );
  }
  Like(korisnicko_ime: string, lokacija: string) {
    var l = lokacija.replaceAll('\\', '$@$');

    return this.http.put(
      this.URL + `api/Korisnik/Like/${korisnicko_ime}/${l}`,
      { responseType: 'text' }
    );
  }
  Unlike(korisnicko_ime: string, lokacija: string) {
    var l = lokacija.replaceAll('\\', '$@$');
    console.log(l);
    console.log(korisnicko_ime);
    return this.http.delete(
      this.URL + `api/Korisnik/Unlike/${korisnicko_ime}/${l}`,
      { responseType: 'text' }
    );
  }
  Comment(korisnicko_ime: string, lokacija: string, tekst: string) {
    var l = lokacija.replaceAll('\\', '$@$');

    return this.http.put(
      this.URL + `api/Korisnik/DodajKomentar/${korisnicko_ime}/${l}/${tekst}`,
      { responseType: 'text' }
    );
  }
  Follow(korisnicko_ime: string, korisnicko_ime_pratimo: string) {
    console.log(korisnicko_ime);
    console.log(korisnicko_ime_pratimo);
    return this.http.put(
      this.URL +
        `api/Korisnik/Follow/${korisnicko_ime}/${korisnicko_ime_pratimo}`,
      { responseType: 'text' }
    );
  }
  Unfollow(korisnicko_ime: string, korisnicko_ime_pratimo: string) {
    return this.http.delete(
      this.URL +
        `api/Korisnik/Unfollow/${korisnicko_ime}/${korisnicko_ime_pratimo}`,
      { responseType: 'text' }
    );
  }
  getTagove(korisnicko_ime: string) {
    return this.http.get<Tag[]>(
      this.URL + `api/Korisnik/PreuzmiTagove/${korisnicko_ime}`
    );
  }
  getTagoveSlika(lokacija: string) {
    var l = lokacija.replaceAll('\\', '$@$');
    return this.http.get<Tag[]>(
      this.URL + `api/Korisnik/PreuzmiTagoveSlika/${l}`
    );
  }
  getDrzave(korisnicko_ime: string) {
    return this.http.get<Drzava[]>(
      this.URL + `api/Korisnik/PreuzmiDrzavu/${korisnicko_ime}`
    );
  }
  getSlike(korisnicko_ime: string) {
    return this.http.get<Slika[]>(
      this.URL + `api/Korisnik/PreuzmiSlike/${korisnicko_ime}`
    );
  }
  pretraziKorisnike(p: string) {
    return this.http.get<Korisnik[]>(
      this.URL + `api/Korisnik/VratiKorisnikePoPaternu/${p}`
    );
  }
  vratiLajkove(lokacija: string) {
    var l = lokacija.replaceAll('\\', '$@$');
    console.log(l);
    return this.http.get<Like[]>(this.URL + `api/Korisnik/VratiLajkove/${l}`);
  }
  vratiKomentare(lokacija: string) {
    var l = lokacija.replaceAll('\\', '$@$');
    console.log('l je: ' + l);
    return this.http.get<Komentar[]>(
      this.URL + `api/Korisnik/VratiKomentare/${l}`
    );
  }
  getFollowere(korisnicko_ime: string) {
    return this.http.get<Korisnik[]>(
      this.URL + `api/Korisnik/VratiFollowere/${korisnicko_ime}`
    );
  }
  getFollowing(korisnicko_ime: string) {
    return this.http.get<Korisnik[]>(
      this.URL + `api/Korisnik/VratiFollowing/${korisnicko_ime}`
    );
  }
  deletePhoto(korisnicko_ime: string, lokacija: string) {
    var l = lokacija.replaceAll('\\', '$@$');
    console.log(korisnicko_ime);
    console.log(l);
    return this.http.delete(
      this.URL + `api/Korisnik/obrisiSliku/${l}/${korisnicko_ime}`
    );
  }
  vratiSveSlike(korisnicko_ime: string) {
    return this.http.get<Slika[]>(
      this.URL + `api/Korisnik/VratiSlike/${korisnicko_ime}`
    );
  }
  vratiSveMentione(korisnicko_ime: string) {
    return this.http.get<Mentions[]>(
      this.URL + `api/Korisnik/VratiMention/${korisnicko_ime}`
    );
  }
  mention(k_ime: string, kogaPominjemo: string, lokacija: string) {
    var l = lokacija.replaceAll('\\', '$@$');
    return this.http.post(
      this.URL + `api/Korisnik/Mention/${l}/${k_ime}/${kogaPominjemo}`,
      { responseType: 'text' }
    );
  }
}

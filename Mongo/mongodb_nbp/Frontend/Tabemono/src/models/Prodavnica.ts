import { kategorija } from './Kategorija';

export interface prodavnica {
  string_id: string;
  ime: string;
  email: string;
  broj_telefona: string;
  adresa: string;
  kategorija: kategorija;
  kategorija_ime: string;
  string_kategorija: string;
  ocena: number;
  broj_ocena: number;
  slika: string;
  lozinka: string;
}

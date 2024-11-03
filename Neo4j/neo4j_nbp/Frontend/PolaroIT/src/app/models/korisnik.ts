import { Time } from '@angular/common';

export interface Korisnik {
  ime: string;
  prezime: string;
  rodjedan: string;
  korisnicko_ime: string;
  lozinka: string;
  email: string;
  online: boolean;
  drzava: string;
  profilnaSlika:string;
}

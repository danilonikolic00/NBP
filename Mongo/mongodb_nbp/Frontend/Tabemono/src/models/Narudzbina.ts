import { Time } from '@angular/common';
import ObjectID from 'bson-objectid';
import { Status } from 'src/enums/enums';
import { korisnik } from './Korisnik';
import { proizvod } from './Proizvod';

export interface narudzbina {
  id: ObjectID;
  id_string: string;
  klijent: korisnik;
  proizvodi: proizvod[];
  cena: number;
  status: Status;
  vreme: Time;
}

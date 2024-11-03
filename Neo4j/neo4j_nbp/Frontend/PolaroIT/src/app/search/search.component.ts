import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Korisnik } from '../models/korisnik';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  patern = '';
  korisnici!: Korisnik[];
  @Output() emiter = new EventEmitter();
  constructor(
    private korisnikService: KorisnikService,
    private cookie: CookieService
  ) {}
  ngOnInit() {
    this.patern = '';
  }

  pretrazi() {
    this.korisnikService.pretraziKorisnike(this.patern).subscribe((result) => {
      if (result) {
        this.korisnici = result;
        console.log(this.korisnici);
      }
    });
  }
  emit(k_ime: string) {
    this.cookie.set('UserProfile', k_ime);
    this.emiter.emit('tudjiProfil');
  }
}

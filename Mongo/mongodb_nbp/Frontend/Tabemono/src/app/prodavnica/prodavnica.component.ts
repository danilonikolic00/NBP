import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProizvodDialogComponent } from '../proizvod-dialog/proizvod-dialog.component';
import { proizvod } from 'src/models/Proizvod';
import { RateDialogComponent } from '../rate-dialog/rate-dialog.component';
import { prodavnica } from 'src/models/Prodavnica';
import { KorisnikService } from '../services/korisnik.service';
import { CookieService } from 'ngx-cookie-service';
import { ProdavnicaService } from '../services/prodavnica.service';
import { subscribeOn } from 'rxjs';

@Component({
  selector: 'app-prodavnica',
  templateUrl: './prodavnica.component.html',
  styleUrls: ['./prodavnica.component.css'],
})
export class ProdavnicaComponent {
  public pr: proizvod[] = [];
  public prod!: prodavnica;
  public buttonVisibility: boolean = false;
  @Input() idprodavnice!: string;
  constructor(
    private cookie: CookieService,
    private dialog: MatDialog,
    private korisnikService: KorisnikService,
    private prodavnicaService: ProdavnicaService
  ) {}
  public product: proizvod = {
    id: '',
    id_string: '',
    ime: 'King burger',
    opis: 'hamburger, or simply burger, is a food consisting of fillings—usually a patty of ground meat, typically beef—placed inside a sliced bun or bread roll. Hamburgers are often served with cheese, lettuce, tomato, onion, pickles, bacon, or chilis; condiments such as ketchup, mustard, mayonnaise, relish, or a "special sauce," often a variation of Thousand Island dressing; and are frequently placed on sesame seed buns. A hamburger patty topped with cheese is called a cheeseburger.[1] The term burger can also be applied to the meat patty on its own, especially in the United Kingdom, where the term patty is rarely used or can even refer to ground beef. Since the term hamburger usually implies beef, for clarity burger may be prefixed with the type of meat or meat substitute used, as in beef burger, turkey burger, bison burger, portobello burger, or veggie burger. In Australia and New Zealand, a piece of chicken breast on a bun is known as a chicken burger, which would generally not be considered to be a burger in the United States; Americans would generally call it a chicken sandwich, but in Australian English and New Zealand English a sandwich requires sliced bread (not a bun), so it would not be considered a sandwich.[2][3] Hamburgers are typically sold at fast-food restaurants, diners, and specialty and high-end restaurants. There are many international and regional variations of hamburgers.',
    cena: 580,
    slika: '/assets/pexels-chevanon-photography-1108117.jpg',
    dostupnost: false,
    kategorija: '',
  };

  ngOnInit() {
    this.prodavnicaService
      .vratiProdavnica(this.idprodavnice)
      .subscribe((data) => {
        this.prod = data;
        this.vratiProizvode();
      });

    this.korisnikService.VratiTip().subscribe((type) => {
      if (type == 1) this.buttonVisibility = true;
    });
  }

  vratiProdavnicu() {
    this.korisnikService.nadjiProdavnicu(this.idprodavnice).subscribe((res) => {
      if (res) {
        res.forEach((element) => {
          this.prod = element;
        });
      }
    });
    this.cookie.delete('idProdavnice');
  }

  vratiProizvode() {
    this.korisnikService
      .vratiProizvode(this.prod.string_id)
      .subscribe((res) => {
        if (res) {
          this.pr = res;
        }
      });
  }
  viewProzivod(p: proizvod) {
    this.dialog.open(ProizvodDialogComponent, {
      data: p,
      width: '60rem',
    });
  }

  rateProdavac() {
    let diaRef = this.dialog.open(RateDialogComponent, {
      data: this.prod.string_id,
      height: '15%',
      width: '20%',
    });

    diaRef.afterClosed().subscribe(() => {
      this.prodavnicaService
        .vratiProdavnica(this.idprodavnice)
        .subscribe((data) => {
          this.prod = data;
          this.vratiProizvode();
        });
    });
  }
  public createImgPathProiz = (slika: any) => {
    return `https://localhost:5001/${slika}`;
  };
}

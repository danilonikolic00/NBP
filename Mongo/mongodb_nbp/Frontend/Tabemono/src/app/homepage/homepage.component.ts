import { DialogRef } from '@angular/cdk/dialog';
import { registerLocaleData } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HomeComponents } from 'src/enums/enums';
import { kategorija } from 'src/models/Kategorija';
import { prodavnica } from 'src/models/Prodavnica';
import { KorpaDialogComponent } from '../korpa-dialog/korpa-dialog.component';
import { NarudzbinaDialogComponent } from '../narudzbina-dialog/narudzbina-dialog.component';
import { ProizvodAddDialogComponent } from '../proizvod-add-dialog/proizvod-add-dialog.component';
import { ProizvodDialogComponent } from '../proizvod-dialog/proizvod-dialog.component';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { KategorijaService } from '../services/kategorija.service';
import { KorisnikService } from '../services/korisnik.service';
import { ProdavnicaService } from '../services/prodavnica.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  public tip!: boolean;
  private pagemode!: string;
  private Ruta: HomeComponents = HomeComponents.none;
  private prodavnice: prodavnica[];
  private prod!: prodavnica;
  public nazivProdavnice: string;
  public searchDialogComponent!: SearchDialogComponent;
  public kategorije: kategorija[] = [];
  public kategorija!: string;
  public idProdavnice!: string;
  public broj: number = 0;
  constructor(
    private matDialog: MatDialog,
    private cookie: CookieService,
    private router: Router,
    private korisnikService: KorisnikService,
    private kategorijaService: KategorijaService,
    private prodavnicaService: ProdavnicaService
  ) {
    this.prodavnice = [];
    this.nazivProdavnice = '';
    this.idProdavnice = '-1';
  }
  ngOnInit() {
    this.kategorijaService.GetAll().subscribe((result) => {
      this.kategorije = result;
    });

    this.prodavnicaService.vratiProizvodeUKorpi().subscribe((res) => {
      this.broj = res.length;
    });

    this.korisnikService.VratiTip().subscribe((rezulatat) => {
      if (rezulatat == 1) {
        this.tip = true;
      } else {
        this.tip = false;
      }
    });
  }

  getTip() {
    return this.tip;
  }

  search() {
    var dialog;
    dialog = this.matDialog.open(SearchDialogComponent, {
      data: this.prodavnice,
      height: 'fit-content',
    });
    dialog.afterClosed().subscribe((data) => {
      if (data != undefined) {
        this.idProdavnice = data;
        this.SetRoute('prodavnica');
      }
    });
  }

  viewKorpa() {
    this.matDialog.open(KorpaDialogComponent, {
      data: null,
      height: 'fit-content',
      width: 'fit-content',
    });
  }

  logout() {
    this.cookie.deleteAll();
    window.location.reload();
    this.korisnikService.logout();
  }

  SetRoute(NewRoute: string) {
    if (NewRoute == 'profil') this.Ruta = HomeComponents.profil;
    else if (NewRoute == 'prodavnica') this.Ruta = HomeComponents.prodavnica;
    else this.Ruta = HomeComponents.none;
  }

  getRoute() {
    return this.Ruta;
  }

  nadjiPoKategoriji(ime: string) {
    this.prodavnicaService
      .getProdavnicePoKategoriji(ime)
      .subscribe((result) => {
        if (result) {
          this.prodavnice = result;
          this.search();
        }
      });
  }

  vratiSveProdavnice() {
    this.korisnikService.vratiProdavnice().subscribe((res) => {
      if (res) {
        this.prodavnice = res;

        this.search();
      }
    });
  }
  nadjiProdavnicu() {
    if (this.nazivProdavnice == '') {
      this.vratiSveProdavnice();
    } else {
      this.korisnikService
        .nadjiProdavnicu(this.nazivProdavnice)
        .subscribe((res) => {
          if (res) {
            this.prodavnice = res;
            this.search();
          }
        });
    }
  }
  ngOnDestroy() {
    this.cookie.delete('idProdavnice');
  }
}

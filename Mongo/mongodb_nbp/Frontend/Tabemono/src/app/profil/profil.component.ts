import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ProfileMode, ProfileType, Status } from 'src/enums/enums';
import { kategorija } from 'src/models/Kategorija';
import { korisnik } from 'src/models/Korisnik';
import { narudzbina } from 'src/models/Narudzbina';
import { prodavnica } from 'src/models/Prodavnica';
import { proizvod } from 'src/models/Proizvod';
import { EditProizvodDialogComponent } from '../edit-proizvod-dialog/edit-proizvod-dialog.component';
import { NarudzbinaDialogComponent } from '../narudzbina-dialog/narudzbina-dialog.component';
import { ProizvodAddDialogComponent } from '../proizvod-add-dialog/proizvod-add-dialog.component';
import { KategorijaService } from '../services/kategorija.service';
import { KorisnikService } from '../services/korisnik.service';
import { ProdavnicaService } from '../services/prodavnica.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent {
  private Type!: ProfileType;
  private profileMode: ProfileMode;
  public klijent!: korisnik;
  public shop!: prodavnica;
  public lozinka: string;
  public Kategorije: kategorija[] = [];
  public Proizvodi!: proizvod[];
  public Narudzbine!: narudzbina[];
  public idProdavnica!: string;

  constructor(
    private serviceKorisnik: KorisnikService,
    private dialog: MatDialog,
    private serviceProdavnica: ProdavnicaService,
    private serviceKategorija: KategorijaService,
    private cookie: CookieService
  ) {
    this.profileMode = ProfileMode.view;
    this.lozinka = '';
  }

  ngOnInit() {
    this.idProdavnica = this.cookie.get('UserID');
    this.serviceKorisnik.VratiTip().subscribe((rezulatat) => {
      if (rezulatat == 1) {
        this.Type = ProfileType.klijent;
        this.serviceKorisnik.GetKlijent().subscribe((dataKorisnik) => {
          this.klijent = dataKorisnik;
        });

        this.serviceKorisnik.GetAllNaruzdbine().subscribe((rezulatat) => {
          this.Narudzbine = rezulatat.reverse();
        });
      } else if (rezulatat == 3) {
        this.Type = ProfileType.prodavnica;
        this.serviceProdavnica.GetProdavnica().subscribe((datashop) => {
          this.shop = datashop;
          this.shop.lozinka = '';
          this.shop.kategorija_ime = '';

          this.serviceKategorija.VratiKategoriju().subscribe((rez) => {
            this.shop.kategorija = rez;
          });
        });
        this.serviceKategorija.GetAll().subscribe((rezulatat) => {
          this.Kategorije = rezulatat;
        });
        this.serviceProdavnica.GetAllProizvodi().subscribe((rezulatat) => {
          this.Proizvodi = rezulatat;
        });
      }
    });
  }

  getProfileMode() {
    return this.profileMode;
  }

  ChangeProfileMode() {
    if (this.profileMode == ProfileMode.view)
      this.profileMode = ProfileMode.edit;
    else {
      this.profileMode = ProfileMode.view;
      if (ProfileType.klijent == this.Type)
        this.serviceKorisnik.GetKlijent().subscribe((dataKorisnik) => {
          this.klijent = dataKorisnik;
        });
      else
        this.serviceProdavnica.GetProdavnica().subscribe((datashop) => {
          this.shop = datashop;
          this.shop.lozinka = '';
          this.shop.kategorija_ime = '';

          this.serviceKategorija.VratiKategoriju().subscribe((rez) => {
            this.shop.kategorija = rez;
          });
        });
    }
  }

  getProfileType() {
    return this.Type;
  }

  izmeniPodatke() {
    this.ChangeProfileMode();
    if (this.Type == ProfileType.klijent) {
      if (this.lozinka != '') this.klijent.lozinka = this.lozinka;
      else this.klijent.lozinka = 'null';

      this.serviceKorisnik
        .IzmeniKlijent(this.klijent)
        .subscribe((result) => {});
    } else {
      if (this.lozinka != '') this.shop.lozinka = this.lozinka;
      else this.shop.lozinka = 'null';
      this.serviceKorisnik.IzmeniShop(this.shop).subscribe((result) => {});
    }
  }

  dodajProizvod() {
    let diaRef = this.dialog.open(ProizvodAddDialogComponent, {
      height: '100%',
      width: '35rem',
    });

    diaRef.afterClosed().subscribe(() => {
      this.serviceProdavnica.GetAllProizvodi().subscribe((rezulatat) => {
        this.Proizvodi = rezulatat;
      });
    });
  }

  ObrisiProizvod(id: string) {
    this.serviceProdavnica.DeleteProizvod(id).subscribe(() => {
      this.serviceProdavnica.GetAllProizvodi().subscribe((rezulatat) => {
        this.Proizvodi = rezulatat;
      });
    });
  }

  ViewProizvod(proizvod: proizvod) {
    let diaRef = this.dialog.open(EditProizvodDialogComponent, {
      height: 'fit-content',
      width: '35rem',
      data: proizvod,
    });

    diaRef.afterClosed().subscribe(() => {
      this.serviceProdavnica.GetAllProizvodi().subscribe((rezulatat) => {
        this.Proizvodi = rezulatat;
      });
    });
  }

  public createImgPath = () => {
    return `https://localhost:5001/${this.shop.slika}`;
  };
  public createImgPathProiz = (slika: any) => {
    return `https://localhost:5001/${slika}`;
  };
  prikazi(p: proizvod[]) {
    this.dialog.open(NarudzbinaDialogComponent, {
      data: [p, Status.dostavljeno],
    });
  }
}

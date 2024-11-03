import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Status } from 'src/enums/enums';
import { proizvod } from 'src/models/Proizvod';
import { NarudzbinaDialogComponent } from '../narudzbina-dialog/narudzbina-dialog.component';
import { ProizvodDialogComponent } from '../proizvod-dialog/proizvod-dialog.component';
import { ProdavnicaService } from '../services/prodavnica.service';

@Component({
  selector: 'app-korpa-dialog',
  templateUrl: './korpa-dialog.component.html',
  styleUrls: ['./korpa-dialog.component.css'],
})
export class KorpaDialogComponent {
  // public product: prozivod = {
  //   id: '',
  //   id_string: '',
  //   ime: 'King burger',
  //   opis: 'hamburger, or simply burger, is a food consisting of fillings—usually a patty of ground meat, typically beef—placed inside a sliced bun or bread roll. Hamburgers are often served with cheese, lettuce, tomato, onion, pickles, bacon, or chilis; condiments such as ketchup, mustard, mayonnaise, relish, or a "special sauce," often a variation of Thousand Island dressing; and are frequently placed on sesame seed buns. A hamburger patty topped with cheese is called a cheeseburger.[1] The term burger can also be applied to the meat patty on its own, especially in the United Kingdom, where the term patty is rarely used or can even refer to ground beef. Since the term hamburger usually implies beef, for clarity burger may be prefixed with the type of meat or meat substitute used, as in beef burger, turkey burger, bison burger, portobello burger, or veggie burger. In Australia and New Zealand, a piece of chicken breast on a bun is known as a chicken burger, which would generally not be considered to be a burger in the United States; Americans would generally call it a chicken sandwich, but in Australian English and New Zealand English a sandwich requires sliced bread (not a bun), so it would not be considered a sandwich.[2][3] Hamburgers are typically sold at fast-food restaurants, diners, and specialty and high-end restaurants. There are many international and regional variations of hamburgers.',
  //   cena: '580rsd',
  //   slika: '/assets/pexels-chevanon-photography-1108117.jpg',
  //   dostupnost: false,
  //   kategorija: '',
  // };
  public brProizvoda: number = 0;
  public proizvodi: proizvod[] = [];
  constructor(
    public dialogRef: MatDialogRef<ProizvodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public products: proizvod[],
    private prodavnicaService: ProdavnicaService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.prodavnicaService.vratiProizvodeUKorpi().subscribe((res) => {
      this.proizvodi = res;
      this.brProizvoda = this.proizvodi.length;
    });
  }

  viewProizvod(p: proizvod) {
    this.matDialog.open(ProizvodDialogComponent, {
      data: p,
      height: '80%',
      width: '80%',
    });
  }
  otvoriNarudzbinu() {
    this.matDialog.open(NarudzbinaDialogComponent, {
      data: [this.proizvodi, Status.poruceno],
    });
  }
  izbaciIzKorpe(id: string) {
    this.prodavnicaService.izbaciProizvodIzKorpe(id).subscribe((res) => {});
    window.location.reload();
  }

  public createImgPathProiz = (slika: any) => {
    return `https://localhost:5001/${slika}`;
  };
}

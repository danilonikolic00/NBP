import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { proizvod } from 'src/models/Proizvod';
import { KorisnikService } from '../services/korisnik.service';
import { ProdavnicaService } from '../services/prodavnica.service';

@Component({
  selector: 'app-proizvod-dialog',
  templateUrl: './proizvod-dialog.component.html',
  styleUrls: ['./proizvod-dialog.component.css'],
})
export class ProizvodDialogComponent {
  public tip!: boolean;
  constructor(
    public dialogRef: MatDialogRef<ProizvodDialogComponent>,
    private prodavnicaService: ProdavnicaService,
    private serviceKorisnik: KorisnikService,
    @Inject(MAT_DIALOG_DATA) public product: proizvod
  ) {}
  ngOnInit() {
    console.log(this.product);
    this.serviceKorisnik.VratiTip().subscribe((rezulatat) => {
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
  dodajUKorpu(p: string) {
    this.prodavnicaService.dodajProizvodUKorpu(p).subscribe((res) => {
      if (res) {
        console.log(true);
        window.location.reload();
      }
    });
  }

  public createImgPathProiz = (slika: any) => {
    return `https://localhost:5001/${slika}`;
  };
}

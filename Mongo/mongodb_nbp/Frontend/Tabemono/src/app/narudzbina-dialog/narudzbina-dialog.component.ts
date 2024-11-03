import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Status } from 'src/enums/enums';
import { proizvod } from 'src/models/Proizvod';
import { ProdavnicaService } from '../services/prodavnica.service';

@Component({
  selector: 'app-narudzbina-dialog',
  templateUrl: './narudzbina-dialog.component.html',
  styleUrls: ['./narudzbina-dialog.component.css'],
})
export class NarudzbinaDialogComponent {
  public proizvodi: proizvod[] = [];
  public ukupnaCena: number = 0;
  public status!: Status;
  constructor(
    @Inject(MAT_DIALOG_DATA) public products: any[],
    private prodavnicaService: ProdavnicaService
  ) {}
  ngOnInit() {
    this.proizvodi = this.products[0];
    this.proizvodi.forEach((p) => {
      this.ukupnaCena += p.cena;
    });
    this.status = this.products[1];
  }
  naruci() {
    this.prodavnicaService.poruci().subscribe((res) => {
      if (res) {
      }
    });
    window.location.reload();
  }
}

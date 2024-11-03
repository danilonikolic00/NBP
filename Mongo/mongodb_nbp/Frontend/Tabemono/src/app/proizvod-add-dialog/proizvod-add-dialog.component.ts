import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { proizvod } from 'src/models/Proizvod';
import { ProdavnicaService } from '../services/prodavnica.service';

@Component({
  selector: 'app-proizvod-add-dialog',
  templateUrl: './proizvod-add-dialog.component.html',
  styleUrls: ['./proizvod-add-dialog.component.css'],
})
export class ProizvodAddDialogComponent {
  public proizvod: proizvod;
  constructor(
    private prodavnicaService: ProdavnicaService,
    private ref: DialogRef<ProizvodAddDialogComponent>
  ) {
    this.proizvod = {
      id: '',
      id_string: '',
      ime: '',
      opis: '',
      cena: 0,
      slika: '',
      dostupnost: true,
      kategorija: '',
    };
  }
  AddProduct() {
    this.prodavnicaService.AddProizvod(this.proizvod).subscribe();
    this.ref.close();
  }
}

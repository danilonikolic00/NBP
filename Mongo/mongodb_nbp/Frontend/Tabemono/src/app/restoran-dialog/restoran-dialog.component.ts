import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import ObjectID from 'bson-objectid';
import { prodavnica } from 'src/models/Prodavnica';
import { ProdavnicaService } from '../services/prodavnica.service';

@Component({
  selector: 'app-restoran-dialog',
  templateUrl: './restoran-dialog.component.html',
  styleUrls: ['./restoran-dialog.component.css'],
})
export class RestoranDialogComponent {
  public NovRestoran: prodavnica;
  constructor(
    public dialogRef: MatDialogRef<RestoranDialogComponent>,
    private prodavnicaService: ProdavnicaService
  ) {
    this.NovRestoran = {
      string_id: '',
      kategorija: {
        id: new ObjectID(),
        id_string: '',
        ime: '',
      },
      kategorija_ime: '',
      string_kategorija: '',
      ime: '',
      email: '',
      broj_telefona: '',
      adresa: '',
      ocena: 0,
      broj_ocena: 0,
      slika: '',
      lozinka: '',
    };
  }
  ngOnInit() {}

  Create() {
    this.prodavnicaService.Create(this.NovRestoran).subscribe();
    this.dialogRef.close();
  }
}

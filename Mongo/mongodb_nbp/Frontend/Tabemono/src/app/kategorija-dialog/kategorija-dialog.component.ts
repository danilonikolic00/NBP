import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObjectUnsubscribedError } from 'rxjs';
import { kategorija } from 'src/models/Kategorija';
import { KategorijaService } from '../services/kategorija.service';
import ObjectID from 'bson-objectid';
@Component({
  selector: 'app-kategorija-dialog',
  templateUrl: './kategorija-dialog.component.html',
  styleUrls: ['./kategorija-dialog.component.css'],
})
export class KategorijaDialogComponent {
  public NovaKat: kategorija;
  constructor(
    public dialogRef: MatDialogRef<KategorijaDialogComponent>,
    private kategorijeService: KategorijaService
  ) {
    this.NovaKat = {
      id: new ObjectID(),
      id_string: '',
      ime: '',
    };
  }
  ngOnInit() {}

  KreirajKategoriju() {
    this.kategorijeService
      .CreateKategorija(this.NovaKat)
      .subscribe((result) => {});
    this.dialogRef.close();
  }
}

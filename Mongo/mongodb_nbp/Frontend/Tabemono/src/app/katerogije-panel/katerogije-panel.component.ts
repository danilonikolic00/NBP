import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { kategorija } from 'src/models/Kategorija';
import { KategorijaDialogComponent } from '../kategorija-dialog/kategorija-dialog.component';
import { KategorijaService } from '../services/kategorija.service';
import ObjectID from 'bson-objectid';
@Component({
  selector: 'app-katerogije-panel',
  templateUrl: './katerogije-panel.component.html',
  styleUrls: ['./katerogije-panel.component.css'],
})
export class KaterogijePanelComponent {
  public KategorijeList: kategorija[] = [];
  public nazivKategorije: string = '';
  constructor(
    private dialog: MatDialog,
    private kategorijeService: KategorijaService
  ) {}
  ngOnInit() {
    this.kategorijeService.GetAll().subscribe((result) => {
      this.KategorijeList = result;
    });
  }

  openKategorijaDialog() {
    this.dialog.open(KategorijaDialogComponent, {
      width: '25rem',
      height: '32rem',
    });
  }

  IzbrisiKategoriju(IDKat: string) {
    this.kategorijeService.Delete(IDKat).subscribe((res) => console.log(res));
    window.location.reload();
  }

  nadjiKategoriju() {
    if (this.nazivKategorije == '') {
      this.kategorijeService.GetAll().subscribe((result) => {
        this.KategorijeList = result;
      });
    } else {
      this.kategorijeService
        .nadjiKategoriju(this.nazivKategorije)
        .subscribe((res) => {
          if (res) {
            this.KategorijeList = res;
          }
        });
    }
  }
}

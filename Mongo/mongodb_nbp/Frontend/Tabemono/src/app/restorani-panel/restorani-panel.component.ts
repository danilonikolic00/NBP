import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { prodavnica } from 'src/models/Prodavnica';
import { RestoranDialogComponent } from '../restoran-dialog/restoran-dialog.component';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-restorani-panel',
  templateUrl: './restorani-panel.component.html',
  styleUrls: ['./restorani-panel.component.css'],
})
export class RestoraniPanelComponent {
  public prodavnice: prodavnica[] = [];
  public nazivProdavnice: string = '';
  constructor(
    public dialog: MatDialog,
    public korisnikService: KorisnikService
  ) {}
  ngOnInit() {
    this.vratiSveProdavnice();
  }

  openRestoranDialog() {
    this.dialog.open(RestoranDialogComponent, {
      height: '100%',
      width: 'fit-content',
      data: this.prodavnice,
    });
  }
  DeleteRestoran(id: string) {
    this.korisnikService.obrisiProdavnicu(id).subscribe((res) => {});
    window.location.reload();
  }
  vratiSveProdavnice() {
    this.korisnikService.vratiProdavnice().subscribe((res) => {
      if (res) {
        this.prodavnice = res;
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
          }
        });
    }
  }
}

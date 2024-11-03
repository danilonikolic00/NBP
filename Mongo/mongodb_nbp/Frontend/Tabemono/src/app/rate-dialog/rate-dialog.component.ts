import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ProizvodDialogComponent } from '../proizvod-dialog/proizvod-dialog.component';
import { ProdavnicaService } from '../services/prodavnica.service';

@Component({
  selector: 'app-rate-dialog',
  templateUrl: './rate-dialog.component.html',
  styleUrls: ['./rate-dialog.component.css'],
})
export class RateDialogComponent {
  private ocena: number;
  constructor(
    public dialogRef: MatDialogRef<RateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private matDialog: MatDialog,
    private prodavnicaService: ProdavnicaService
  ) {
    this.ocena = 0;
  }
  ngOnInit() {}
  SetOcena(rate: string) {
    this.ocena = parseInt(rate);
  }

  Oceni() {
    this.prodavnicaService.Oceni(this.data, this.ocena).subscribe();
    this.dialogRef.close();
  }
}

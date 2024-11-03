import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { prodavnica } from 'src/models/Prodavnica';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.css'],
})
export class SearchDialogComponent {
  public prodavnice!: prodavnica[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: prodavnica[],
    private cookie: CookieService,
    public dialogRef: MatDialogRef<SearchDialogComponent>
  ) {
    this.prodavnice = data;
  }

  izaberiProdavnicu(id: string) {
    this.dialogRef.close(id);
  }
}

import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileMode } from 'src/enums/enums';
import { proizvod } from 'src/models/Proizvod';
import { ProdavnicaService } from '../services/prodavnica.service';

@Component({
  selector: 'app-edit-proizvod-dialog',
  templateUrl: './edit-proizvod-dialog.component.html',
  styleUrls: ['./edit-proizvod-dialog.component.css'],
})
export class EditProizvodDialogComponent {
  public editproizvod!: proizvod;
  private profileMode: ProfileMode;
  constructor(
    private ref: DialogRef<EditProizvodDialogComponent>,
    private serviceProdavnica: ProdavnicaService,
    @Inject(MAT_DIALOG_DATA) public products: proizvod
  ) {
    this.editproizvod = products;
    this.profileMode = ProfileMode.view;
  }

  IzmeniProizvod() {
    this.serviceProdavnica.IzmeniProizvod(this.editproizvod).subscribe((result) => {
      console.log(result);
    });
    this.ref.close();
  }
  ChangeProfileMode() {
    if (this.profileMode == ProfileMode.view)
      this.profileMode = ProfileMode.edit;
    else this.profileMode = ProfileMode.view;
  }
  getProfileMode() {
    return this.profileMode;
  }
}

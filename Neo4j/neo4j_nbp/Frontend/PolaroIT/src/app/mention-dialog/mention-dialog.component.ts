import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { Mentions } from '../models/mention';
import { Slika } from '../models/slika';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-mention-dialog',
  templateUrl: './mention-dialog.component.html',
  styleUrls: ['./mention-dialog.component.css'],
})
export class MentionDialogComponent {
  // zamenite tip promenjive mentions sa Mention[] namestite u pozivu dialoga
  constructor(
    @Inject(MAT_DIALOG_DATA) public mentions: Mentions[],
    private matDialogRef: MatDialogRef<ProfileDialogComponent>,
    private dialog: MatDialog,
    private cookie: CookieService
  ) {}

  ngOnInit() {}
  ngOnDestroy() {
    this.matDialogRef.close(this.mentions);
  }

  // slika: Slika ubacite sliku u parametar funkcije
  OpenPhoto(m:Mentions) {
    let t = {
      lokacija:
        m.slika,
     // broj_komentara: m.slika,
     // broj_lajkova: 0,
    };
    this.dialog.open(ProfileDialogComponent, {
      width: 'fit-content',
      height: '100%',
      data: t, // slika
    });
  }
}

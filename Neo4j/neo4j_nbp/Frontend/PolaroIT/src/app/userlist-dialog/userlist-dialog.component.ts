import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';

@Component({
  selector: 'app-userlist-dialog',
  templateUrl: './userlist-dialog.component.html',
  styleUrls: ['./userlist-dialog.component.css'],
})
export class UserlistDialogComponent {
  @Output() emiter = new EventEmitter<string>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public imena: string[],
    private matDialogRef: MatDialogRef<UserlistDialogComponent>,
    private dialog: MatDialog,
    private cookie: CookieService
  ) {}

  ngOnInit() {
    console.log(this.imena);
  }
  OpenProfile(name: string) {
    this.emiter.emit(name);
    this.matDialogRef.close();
  }
  ngOnDestroy() {
    //this.emiter.emit(this.imena);
  }
}

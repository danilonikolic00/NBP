import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { Slika } from '../models/slika';
import { UserlistDialogComponent } from '../userlist-dialog/userlist-dialog.component';
import { KorisnikService } from '../services/korisnik.service';
import { Like } from '../models/like';
import { Komentar } from '../models/komentar';
import { Tag } from '../models/tag';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css'],
})
export class ProfileDialogComponent {
  @Output() emiter = new EventEmitter<string>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Slika,
    private matDialogRef: MatDialogRef<ProfileDialogComponent>,
    private dialog: MatDialog,
    protected cookie: CookieService,
    private korisnikservis: KorisnikService
  ) {}
  public username: string = this.cookie.get('LoggedIn');
  public lajks: Like[] = [];
  public stringLajks: string[] = [];
  public koments: Komentar[] = [];
  public stringKoments: string[] = [];
  public tags: Tag[] = [];
  public changeMode: boolean = true;
  public InputTags: string = '';
  ngOnInit() {
    this.lajkovi();
    this.komentari();
    this.getTagoviSlika();
  }

  ngOnDestroy() {
    this.matDialogRef.close(this.data);
  }
  Like() {
    this.korisnikservis
      .Like(this.username, this.data.lokacija)
      .subscribe((result) => {
        if (result) {
          this.lajkovi();
        }
      });
  }
  Unlike() {
    console.log(this.username);
    console.log(this.data.lokacija);
    this.korisnikservis
      .Unlike(this.username, this.data.lokacija)
      .subscribe((result) => {
        if (result) {
          this.lajkovi();
        }
      });
  }
  Comment(text: string) {
    this.korisnikservis
      .Comment(this.username, this.data.lokacija, text)
      .subscribe((result) => {
        if (result) {
          this.komentari();
        }
      });
  }

  changePhotoInfo() {
    console.log(this.InputTags);
    this.korisnikservis
      .changePhotoInfo(this.data.lokacija, this.InputTags)
      .subscribe((result) => {
        if (result) {
        }
      });
  }

  Lista_Comment() {
    this.korisnikservis
      .vratiKomentare(this.data.lokacija)
      .subscribe((result) => {
        if (result) {
          console.log(result);
          this.koments = result;
          this.data.broj_komentara = this.koments.length;
        }
      });
    this.stringKoments = this.koments.map((tag) => tag.salje.korisnicko_ime);
    console.log(this.stringKoments);
    let dialogRef = this.dialog.open(UserlistDialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      maxHeight: '30rem',
      panelClass: 'UserlistDialog-modalbox',
      data: this.stringKoments,
    });

    dialogRef.componentInstance.emiter.subscribe((result: string) => {
      console.log('prosao kroz pdialog');
      if (result.length > 1 && this.cookie.get('UserProfile') != result) {
        {
          this.emiter.emit(result);
          this.matDialogRef.close();
        }
        //this.cookie.set('UserProfile', result);
      }
    });
  }
  lajkovi() {
    this.korisnikservis.vratiLajkove(this.data.lokacija).subscribe((result) => {
      if (result) {
        console.log(result);
        this.lajks = result;
        this.data.broj_lajkova = this.lajks.length;
      }
    });
  }
  getTagoviSlika() {
    this.korisnikservis
      .getTagoveSlika(this.data.lokacija)
      .subscribe((result) => {
        if (result) {
          console.log(result);
          this.tags = result;
        }
      });
  }
  komentari() {
    this.korisnikservis
      .vratiKomentare(this.data.lokacija)
      .subscribe((result) => {
        if (result) {
          console.log(result);
          this.koments = result;
          this.data.broj_komentara = this.koments.length;
        }
      });
  }
  deletePhoto() {
    this.korisnikservis
      .deletePhoto(this.username, this.data.lokacija)
      .subscribe((result) => {
        if (result) {
        }
      });
  }
  Lista_Like() {
    this.korisnikservis.vratiLajkove(this.data.lokacija).subscribe((result) => {
      if (result) {
        console.log(result);
        this.lajks = result;
        this.data.broj_lajkova = this.lajks.length;
      }
    });
    this.stringLajks = this.lajks.map((tag) => tag.salje.korisnicko_ime);
    console.log(this.stringLajks);
    let dialogRef = this.dialog.open(UserlistDialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      maxHeight: '30rem',
      panelClass: 'UserlistDialog-modalbox',
      data: this.stringLajks,
    });

    dialogRef.componentInstance.emiter.subscribe((result: string) => {
      console.log('prosao kroz pdialog');
      if (result.length > 1 && this.cookie.get('UserProfile') != result) {
        {
          this.emiter.emit(result);
          this.matDialogRef.close();
        }
        //this.cookie.set('UserProfile', result);
      }
    });
  }
  Pomeni(k_ime: string) {
    this.korisnikservis
      .mention(this.cookie.get('LoggedIn'), k_ime, this.data.lokacija)
      .subscribe((result) => {
        if (result) {
          console.log(result);
        }
      });
  }
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  };
  PromeniMod() {
    this.changeMode = !this.changeMode;
    this.InputTags = this.tags.map((tag) => tag.naziv).join(',');
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ForyouComponent } from '../foryou/foryou.component';
import { MentionDialogComponent } from '../mention-dialog/mention-dialog.component';
import { Drzava } from '../models/drzava';
import { Korisnik } from '../models/korisnik';
import { Mentions } from '../models/mention';
import { Slika } from '../models/slika';

import { Tag } from '../models/tag';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { KorisnikService } from '../services/korisnik.service';
import { UserlistDialogComponent } from '../userlist-dialog/userlist-dialog.component';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent {
  @Output() emiter = new EventEmitter();
  constructor(
    private korisnikservis: KorisnikService,
    private ruta: Router,
    protected cookie: CookieService,
    protected dialog: MatDialog
  ) {
    this.getSlike();
  }
  response!: { dbPath: '' };
  public CurrentKorisnik!: Korisnik;
  public CurrentTags: Tag[] = [];
  public CurrentDrzave: Drzava[] = [];
  public CurrentSlike: Slika[] = [];
  public changeMode: boolean = true;
  public InputTags: string = '';
  public itemsList: string[] = [];
  public ziviDrzava: string = '';
  public preferiraDrzava: string = '';
  public listFollowing: Korisnik[] = [];
  public listFollowere: Korisnik[] = [];
  public stringFollowing: string[] = [];
  public stringFollowers: string[] = [];
  public listaMentiona: Mentions[] = [];

  // Template za pozivanje mention (data zamenite sa Mention[])
  // this.dialog.open(MentionDialogComponent, {
  //   width: 'fit-content',
  //   height: 'fit-content',
  //   maxHeight: '30rem',
  //   panelClass: 'UserlistDialog-modalbox',
  //   data: ['Jovan', 'Petar', 'Pavle', 'Ivan'],
  // });

  ngOnInit() {
    this.CurrentKorisnik = {
      ime: '',
      prezime: '',
      rodjedan: '',
      korisnicko_ime: '',
      lozinka: '',
      email: '',
      online: false,
      drzava: '',
      profilnaSlika: '',
    };
    this.changeMode = true;
    this.getKorisnik(this.cookie.get('UserProfile'));
    this.getDrzave();
    this.getTagove();
    this.vratiFollowere();
    this.vratiFollowing();
    this.vratiMention();
    console.log(this.CurrentKorisnik);
    console.log(this.CurrentTags);
    console.log(this.CurrentDrzave);
    console.log(this.CurrentSlike);
    console.log(this.listFollowere);
    console.log(this.listFollowing);
    this.ziviDrzava = this.CurrentDrzave[0].naziv;
    this.preferiraDrzava = this.CurrentDrzave[1].naziv;
    // Template za pozivanje mention (data zamenite sa Mention[])
  }
  getKorisnik(username: string) {
    this.korisnikservis.getKorisnik(username).subscribe((result) => {
      if (result) {
        this.CurrentKorisnik.ime = result.ime;
        this.CurrentKorisnik.prezime = result.prezime;
        this.CurrentKorisnik.email = result.email;
        this.CurrentKorisnik.rodjedan = result.rodjedan;
        this.CurrentKorisnik.profilnaSlika = result.profilnaSlika;
      }
    });
  }
  changeKorisnik() {
    this.korisnikservis
      .changeKorisnik(
        this.cookie.get('LoggedIn'),
        this.CurrentKorisnik.ime,
        this.CurrentKorisnik.prezime,
        this.CurrentKorisnik.rodjedan,
        this.CurrentKorisnik.email
      )
      .subscribe((result) => {
        if (result) {
          this.CurrentKorisnik.ime = result.ime;
          this.CurrentKorisnik.prezime = result.prezime;
          this.CurrentKorisnik.email = result.email;
          this.CurrentKorisnik.rodjedan = result.rodjedan;
        }
        window.location.reload();
      });
  }
  changePreferences() {
    console.log(this.InputTags);
    this.korisnikservis
      .changePreference(
        this.cookie.get('LoggedIn'),
        this.InputTags,
        this.preferiraDrzava
      )
      .subscribe((result) => {
        if (result) {
          this.getTagove();
          this.getDrzave();
        }
      });
    console.log('a');
    console.log(this.preferiraDrzava);
    console.log(this.CurrentTags);
  }

  showFollowing() {
    this.stringFollowing = this.listFollowing.map((tag) => tag.korisnicko_ime);
    this.dialog.open(UserlistDialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      maxHeight: '30rem',
      panelClass: 'UserlistDialog-modalbox',
      data: this.stringFollowing,
    });
  }
  Follow() {
    this.korisnikservis
      .Follow(this.cookie.get('LoggedIn'), this.cookie.get('UserProfile'))
      .subscribe((result) => {
        if (result) {
        }
      });
  }
  Unfollow() {
    this.korisnikservis
      .Unfollow(this.cookie.get('LoggedIn'), this.cookie.get('UserProfile'))
      .subscribe((result) => {
        if (result) {
        }
      });
  }
  showFollowers() {
    this.stringFollowers = this.listFollowere.map((tag) => tag.korisnicko_ime);
    this.dialog.open(UserlistDialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      maxHeight: '30rem',
      panelClass: 'UserlistDialog-modalbox',
      data: this.stringFollowers,
    });
  }

  getTagove() {
    this.korisnikservis
      .getTagove(this.cookie.get('LoggedIn'))
      .subscribe((result) => {
        if (result) {
          this.CurrentTags = result;
        }
      });
  }

  getDrzave() {
    this.korisnikservis
      .getDrzave(this.cookie.get('LoggedIn'))
      .subscribe((result) => {
        if (result) {
          this.CurrentDrzave = result;
          this.ziviDrzava = this.CurrentDrzave[0].naziv;
          this.preferiraDrzava = this.CurrentDrzave[1].naziv;
        }
      });
  }
  getSlike() {
    this.korisnikservis
      .getSlike(this.cookie.get('UserProfile'))
      .subscribe((result) => {
        if (result) {
          this.CurrentSlike = result;
        }
      });
  }
  PromeniMod() {
    this.changeMode = !this.changeMode;
    this.InputTags = this.CurrentTags.map((tag) => tag.naziv).join(',');
    console.log(this.CurrentKorisnik);
  }

  openPhotoz(slika: Slika) {
    // this.lajkovi(slika.lokacija);
    // this.komentari(slika.lokacija);
    let dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: 'fit-content',
      height: '100%',
      data: slika,
    });
    dialogRef.componentInstance.emiter.subscribe((result: string) => {
      if (result.length > 1 && this.cookie.get('UserProfile') != result) {
        {
          this.cookie.set('UserProfile', result);
          this.emiter.emit('tudjiProfil2');
        }
      }
    });
  }

  uploadFinished = (event: any) => {
    this.response = event;
    this.getKorisnik(this.cookie.get('UserProfile'));
    this.getSlike();
  };
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  };

  lajkovi(lokacija: string) {
    this.korisnikservis.vratiLajkove(lokacija).subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }
  komentari(lokacija: string) {
    this.korisnikservis.vratiKomentare(lokacija).subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }
  vratiFollowing() {
    this.korisnikservis
      .getFollowing(this.cookie.get('UserProfile'))
      .subscribe((result) => {
        if (result) {
          this.listFollowing = result;
        }
      });
  }
  vratiFollowere() {
    this.korisnikservis
      .getFollowere(this.cookie.get('UserProfile'))
      .subscribe((result) => {
        if (result) {
          this.listFollowere = result;
        }
      });
  }
  vratiMention() {
    this.korisnikservis
      .vratiSveMentione(this.cookie.get('LoggedIn'))
      .subscribe((result) => {
        if (result) {
          this.listaMentiona = result;
          console.log(this.listaMentiona);
        }
      });
  }
  OpenMentions() {
    this.dialog.open(MentionDialogComponent, {
      width: 'fit-content',
      height: 'fit-content',
      maxHeight: '30rem',
      panelClass: 'UserlistDialog-modalbox',
      data: this.listaMentiona,
    });
  }
}

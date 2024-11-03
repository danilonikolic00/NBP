import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { Slika } from '../models/slika';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-foryou',
  templateUrl: './foryou.component.html',
  styleUrls: ['./foryou.component.css'],
})
export class ForyouComponent {
  constructor(protected dialog: MatDialog, private korisnikservice:KorisnikService, private cookie:CookieService ) {}
  public slike: Slika[] = [];
  public slike2:Slika[]=[];

  ngOnInit() {
    // this.dialog.open(ProfileDialogComponent, {
    //   data: this.test,
    //   width: 'fit-content',
    //   height: '100%',
    // });
    this.vratiSlike();
    // this.slike[0] = {
    //   lokacija:
    //     'https://i.pinimg.com/originals/b6/10/a2/b610a27f1695cd2886bbe33651cccc73.jpg',
    //   broj_komentara: 0,
    //   broj_lajkova: 0,
    // };

    // this.slike[1] = {
    //   lokacija:
    //     'https://64.media.tumblr.com/019a19885acee5e88aac99446c22623d/tumblr_o7nz1oiA6p1vvzqnvo1_1280.jpg',
    //   broj_komentara: 0,
    //   broj_lajkova: 0,
    // };

    // this.slike[2] = {
    //   lokacija:
    //     'https://8list.ph/wp-content/uploads/2020/08/4bbd102a292e7fc144c557cf462d1f8a.jpg',
    //   broj_komentara: 0,
    //   broj_lajkova: 0,
    // };
  }

  TestServices() {}

  openPhoto(slika: Slika) {
    this.dialog.open(ProfileDialogComponent, {
      data: slika,
      width: 'fit-content',
      height: '100%',
      disableClose: false,
    });
  }
  vratiSlike()
  {
    this.korisnikservice.vratiSveSlike(this.cookie.get("LoggedIn")).subscribe((result)=>{
      if(result){
        this.slike2=result;
        result.forEach(el => {
          console.log(el);
          
        });
        // console.log("ki: "+this.cookie.get("LoggedIn"));
        // console.log("result: "+result);
        // console.log("sve slike: "+this.slike2);
      }
    });
  }
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  };
  ngOnDestroy() {
    this.dialog.closeAll();
  }
}

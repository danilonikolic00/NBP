import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KorisnikService } from '../services/korisnik.service';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-upload-profil',
  templateUrl: './upload-profil.component.html',
  styleUrls: ['./upload-profil.component.css']
})
export class UploadProfilComponent {
  progress!: number;
  message!: string;
  @Output() public onUploadFinished = new EventEmitter();
  private readonly URL = 'https://localhost:5001/';

  public InputTags: string = '';
  public InputDrzava: string = '';
  constructor(private http: HttpClient,private korisnikservis: KorisnikService,private cookies:CookieService,private app:AppComponent) {}

  ngOnInit() {}

  uploadFile = (files:any) => 
  {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    console.log(formData);

        this.http.post(this.URL +
        `api/Korisnik/UploadProfilePicture/${this.cookies.get('LoggedIn')}`, formData, {reportProgress: true, observe: 'events'})
        .subscribe({
          next: (event:any) => {
            this.onUploadFinished.emit(event.body);
        }});
  }
}

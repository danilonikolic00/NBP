import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KorisnikService } from '../services/korisnik.service';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  progress!: number;
  message!: string;
  @Output() public onUploadFinished = new EventEmitter();
  private readonly URL = 'https://localhost:5001/';

  public InputTags: string = '';
  public InputDrzava: string = '';
  constructor(
    private http: HttpClient,
    private korisnikservis: KorisnikService,
    private cookies: CookieService,
    private app: AppComponent
  ) {}

  ngOnInit() {}

  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    console.log(formData);
    if (this.InputDrzava == '') this.InputDrzava = 'default';
    if (this.InputTags == '') this.InputTags = 'default';
    this.http
      .post(
        this.URL +
          `api/Korisnik/UploadPicture/${this.cookies.get('LoggedIn')}/${
            this.InputDrzava
          }/${this.InputTags}`,
        formData,
        { reportProgress: true, observe: 'events' }
      )
      .subscribe({
        next: (event: any) => {
          this.onUploadFinished.emit(event.body);
        },
      });
  };
}

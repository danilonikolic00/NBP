import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from '../app.component';
import { KorisnikService } from '../services/korisnik.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  progress!: number;
  message!: string;
  @Output() public onUploadFinished = new EventEmitter();
  @Input() public idProizvoda!: string;
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
    if (this.cookies.get('UserID') == this.idProizvoda) {
      this.http
        .post(
          this.URL +
            `api/Tabemono/DodajSlikuProdavnica/${this.cookies.get('UserID')}`,
          formData,
          { reportProgress: true, observe: 'events' }
        )
        .subscribe({
          next: (event: any) => {
            this.onUploadFinished.emit(event.body);
          },
        });
    } else {
      this.http
        .post(
          this.URL + `api/Tabemono/DodajSlikuProizvod/${this.idProizvoda}`,
          formData,
          { reportProgress: true, observe: 'events' }
        )
        .subscribe({
          next: (event: any) => {
            this.onUploadFinished.emit(event.body);
          },
        });
    }
  };
}

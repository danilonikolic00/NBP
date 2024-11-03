import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PolaroIT';
  public comp!: boolean;
  constructor(private cookie: CookieService) {}

  ngOnInit() {
    if (this.cookie.get('LoggedIn')) this.comp = true;
    else this.comp = false;
  }
}

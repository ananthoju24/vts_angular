import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vtsapp';

  getUsername() {
    return localStorage.getItem("username");
  }

  getAuthtoken(){
    return localStorage.getItem("Auth-Token")
  }
}

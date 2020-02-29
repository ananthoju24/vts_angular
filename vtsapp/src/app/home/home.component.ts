import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  searchPage() {
    console.log("Navigating to search page ");
    this.router.navigateByUrl("search/tax");
  }

  enrollPage() {
    console.log("Navigating to enroll page ");
    this.router.navigateByUrl("enroll");
  }

}

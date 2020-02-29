import { Component, OnInit } from '@angular/core';
import { VtsService } from '../vts.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { VtsdataserviceService } from '../vtsdataservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private vtsService: VtsService, private router: Router, private appComp: AppComponent, private vtsDataSrevice : VtsdataserviceService) { }

  ngOnInit() {
  }

  logOut() {
    localStorage.clear();
    this.router.navigateByUrl('');
  }

  getUsername() {
    return this.appComp.getUsername();
  }
  searchPage() {
    console.log("Navigating to search page ");
    this.router.navigateByUrl("search/tax");
  }

  enrollPage() {
    console.log("Navigating to enroll page ");
    this.router.navigateByUrl("enroll");
  }
  homePage() {
    console.log("Navigating to hoeme page ");
    this.router.navigateByUrl("home");
  }

  auditPage() {
    console.log("Navigating to audit/transactions page ");
    this.router.navigateByUrl("audit");
  }
}

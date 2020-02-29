import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { VtsService } from '../vts.service';
import { User } from '../user';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private vtsService: VtsService, private router: Router, private fromBuilder: FormBuilder) { }
  loginForm: FormGroup;
  isSubmitted = false;
  errorMessage = '';
  ngOnInit() {
    this.loginData();
  }
  loginData() {
    this.loginForm = this.fromBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get formControls() { return this.loginForm.controls; }

  login() {
    this.isSubmitted = true;
    this.vtsService.postService(VtsService.serviceURL.login, this.loginForm.value).subscribe(response => {
      console.log("Response "+JSON.stringify(response));
      if (response.respCode == 200) {
        console.log("success login");
        localStorage.setItem("Auth-Token", response.authToken)
        localStorage.setItem ("username", response.userName)
        this.router.navigateByUrl('home');
      } else if(response.respCode == 400) {
        this.errorMessage = 'Please enter valid username/password';
      }
    })
  }
}

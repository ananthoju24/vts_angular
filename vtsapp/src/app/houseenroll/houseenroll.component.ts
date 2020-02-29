import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VtsService } from '../vts.service';

@Component({
  selector: 'app-houseenroll',
  templateUrl: './houseenroll.component.html',
  styleUrls: ['./houseenroll.component.css']
})
export class HouseenrollComponent implements OnInit {

  houseEnrollForm: FormGroup;
  constructor(private vtsService: VtsService) { }
  isSubmitted = false;
  enrollResponse = '';
  successClass: any;
  ngOnInit() {
    this.initHEF();
  }

  initHEF() {
    this.houseEnrollForm = new FormGroup({
      houseNumber: new FormControl('', [Validators.required,Validators.minLength(1),Validators.maxLength(10)]),
      ownerName: new FormControl('', [Validators.required,Validators.minLength(1),Validators.maxLength(30)]),
      fhName: new FormControl('', [Validators.required,Validators.minLength(1),Validators.maxLength(30)]),
      mobileNumber: new FormControl('', [Validators.required,Validators.minLength(1),Validators.maxLength(10)])
    });
  }

  enroll() {
    this.isSubmitted = true;
    if (this.houseEnrollForm.invalid) {
      console.log(" form invalid ");
      return;
    }
    this.vtsService.postService(VtsService.serviceURL.enrollhouse, this.houseEnrollForm.value).subscribe(response => {
      console.log(" reposne from sevr :: " + JSON.stringify(response));
      this.processResponse(response);
    })
    console.log(" Add house values " + JSON.stringify(this.houseEnrollForm.value));
  }

  private processResponse(response: any) {
    if (response.respCode == 200) {
      this.enrollResponse = 'ఇంటి నమోదు విజయవంతమైంది';
      this.successClass = true;
    } else if (response.respCode == 400) {
      this.enrollResponse = "ఇంటి నమోదు విఫలమైంది";
      this.successClass = false;
    } else if (response.respCode == 401) {
      this.enrollResponse = "ఇప్పటికే ఇంటి సంఖ్య నమోదు చేయబడింది";
      this.successClass = false;
    } else if (response.respCode == 101) {
      this.enrollResponse = "సాంకేతిక లోపం దయచేసి నిర్వాహకుడిని సంప్రదించండి";
      this.successClass = false;
    }
    this.houseEnrollForm.reset();
    this.isSubmitted = false;
    setTimeout(()=> {this.enrollResponse='';},3000)
  }

}

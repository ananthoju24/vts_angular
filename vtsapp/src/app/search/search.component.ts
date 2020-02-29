import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { VtsService } from '../vts.service';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { VtsdataserviceService } from '../vtsdataservice.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private vtsDataService: VtsdataserviceService, private vtsService: VtsService, private router: Router, private fromBuilder: FormBuilder) { }
  searchErrMsg = '';
  houseNumber = '';
  searchForm: FormGroup;
  showResult = false;
  viewURL: any;
  isSubmitted = false;
  hoBean: any;

  ngOnInit() {
    this.initSearchForm();
  }
  initSearchForm() {
    this.searchForm = new FormGroup({
      houseNum: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(10)])
    });
  }

  get formControls() {
    return this.searchForm.controls;
  }
  search() {
    this.isSubmitted = true;
    console.log(" this.searchForm.value  " + this.searchForm.value);
    this.vtsService.postService(VtsService.serviceURL.search, this.searchForm.value).subscribe(response => {
      console.log(" reposne from sevr :: " + response);
      if (response.respCode == 200) {
        this.showResult = true;
        this.hoBean = response.payLoad;
        this.houseNumber = this.hoBean.houseNumber;
        //this.router.navigateByUrl('viewtax');
      } else if (response.respCode == 400) {
        this.searchErrMsg = "దయచేసి చెల్లుబాటు అయ్యే ఇంటి సంఖ్యను నమోదు చేయండి";
      } else if (response.respCode == 101) {
        this.searchErrMsg = "సాంకేతిక లోపం దయచేసి నిర్వాహకుడిని సంప్రదించండి";
      }
    })
    setTimeout(() => { this.searchErrMsg = ''; }, 5000);
  }

  viewTax() {
    localStorage.setItem("hno", this.houseNumber);
    this.viewURL = 'viewtax';
    this.router.navigateByUrl(this.viewURL);
  }

  viewTransaction() {
    localStorage.setItem("hno", this.houseNumber);
    this.router.navigateByUrl("transaction");
  }
}

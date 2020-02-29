import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { VtsService } from '../vts.service';
import { VtsdataserviceService } from '../vtsdataservice.service';

declare var $: any;

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  addTaxForm: FormGroup;
  editTaxForm: FormGroup;
  taxPaymentForm: FormGroup;
  houseNumber: any;
  taxList: any = [];
  prevTaxList: any = [];
  editTaxList: any = [];
  searchErrMsg: any;
  addTaxResponse: any;
  successClass: any;
  private sub: any;
  htax: any = 0;
  taxPayment: any;
  isAddSubmitted = false;
  isEditSubmitted = false;
  isPaySubmitted = false;
  isPayemntFormOpened = false;
  totalTaxAmt = 0;
  transactionPrint: any;
  currentTax: any;
  dueTax: any;
  houseInfo: any;
  paymentResp: any;
  paymentCode: any;
  mySubscription: any;
  totalPayment: boolean = false;
  partialPayment: boolean = false;
  errorMessage: String = '';
  houseTaxError: boolean = false;
  libraryTaxError: boolean = false;
  lightTaxError: boolean = false;
  drainageTaxError: boolean = false;
  waterTaxError: boolean = false;
  kulaiNelaVariFeeError: boolean = false;
  kulaiDepositError: boolean = false;
  licenseFeeError: boolean = false;
  houseConstructionFeeError: boolean = false;
  dakhalaFeeError: boolean = false;
  bandhelaDoddiError: boolean = false;
  buildingRentsError: boolean = false;
  otherValueError: boolean = false;
  taxYearError: boolean = false;
  isCancelTax: boolean = false;
  cancelTaxId: any;

  taxFieldsArry = ["houseTax", "libraryTax", "lightTax", "drainageTax", "waterTax", "kulaiNelaVariFee", "kulaiDeposit", "licenseFee", "houseConstructionFee", "dakhalaFee", "bandhelaDoddi", "buildingRents", "otherValue", "taxYear", "transactionDate"];

  otherKeys = { "1": "ఇతరములు", "2": "చెట్లు నర్కడ౦", "3": "పశువులు మొక్కలను తినడం", "4": "పరిసరల అశుబ్రత" };
  defaultSelect = 1;

  isTaxAvailable: boolean = false;
  isEmptyTax: boolean = false;
  isEditTaxAvailable: boolean = false;
  transactionId: string;

  today = new Date();

  editTaxVal: any;


  constructor(private vtsDataService: VtsdataserviceService, private router: Router, private activatedRoute: ActivatedRoute, private vtsService: VtsService, private fromBuilder: FormBuilder, private modalService: NgbModal) {
    console.log("otherKeys " + JSON.stringify(this.otherKeys));
    this.today.setDate(this.today.getDate());
  }

  ngOnInit() {
    this.houseNumber = localStorage.getItem("hno");
    console.log(" houseNumber " + this.houseNumber);
    var houseObj = { "houseNum": this.houseNumber };
    this.fetchTaxDetails(houseObj);
    this.initAddForms();
    this.initEditForms();
    this.initPayForms();
  }

  fetchTaxDetails(houseObj) {
    console.log(" Request object " + JSON.stringify(houseObj));
    this.vtsService.postService(VtsService.serviceURL.fetchTax, houseObj).subscribe(response => {
      if (response.respCode == 200) {
        this.taxList = response.payLoad;
      }
    })
  }

  addTax() {
    this.isAddSubmitted = true;
    const controls = this.addTaxForm.controls;
    this.addTaxForm.controls.houseNumber.setValue(this.houseNumber);
    for (const name in controls) {
      if (controls[name].invalid) {
        console.log("Invalid field " + name);
      }
    }
    if (this.addTaxForm.invalid) {
      console.log(" form invalid ");
      return;
    }
    console.log("Add tax values :: " + this.addTaxForm.value);
    this.vtsService.postService(VtsService.serviceURL.addTax, this.addTaxForm.value).subscribe(response => {
      console.log("Response from server for add : " + JSON.stringify(response));
      this.processResponse(response);
    })
    this.isTaxAvailable = false;
  }

  editTaxUpdate() {
    console.log(" editTaxUpdate " + JSON.stringify(this.addTaxForm.value));
    this.vtsService.postService(VtsService.serviceURL.updateTaxDetails, this.addTaxForm.value).subscribe(response => {
      console.log("Response from server for add : " + JSON.stringify(response));
      if (response.respCode == 200) {
        this.taxList = response.payLoad;
        this.addTaxResponse = 'పన్ను విజయవంతంగా నవీకరించబడింది';
        this.successClass = true;
      } else if (response.respCode == 400) {
        this.addTaxResponse = "పన్ను నవీకరించబడింది విఫలమైంది";
        this.successClass = false;
      } else if (response.respCode == 101) {
        this.addTaxResponse = "సాంకేతిక లోపం దయచేసి నిర్వాహకుడిని సంప్రదించండి";
        this.successClass = false;
      }
      $('#addTaxModal').modal('hide');
      var houseObj = { "houseNum": this.houseNumber };
      this.fetchTaxDetails(houseObj);
      setTimeout(() => { this.addTaxResponse = ''; }, 8000);
    })
  }
  payment() {
    this.isPaySubmitted = true;
    const controls = this.taxPaymentForm.controls;
    console.log(this.taxPaymentForm.value);
    this.taxPaymentForm.controls.houseNumber.setValue(this.houseNumber);
    this.taxPaymentForm.controls.taxId.setValue(this.taxPayment.taxId);
    this.taxPaymentForm.controls.taxYear.setValue(this.taxPayment.taxYear);
    this.taxPaymentForm.controls.othersKey.setValue(this.taxPayment.othersKey);
    //this.taxPaymentForm.controls.transactionDate.setValue(this.taxPayment.transactionDate);
    if (this.totalPayment) {
      this.taxPaymentForm.controls.paymentType.setValue('totalPayment');
    } else {
      if (!this.isPaymentFormValid()) {
        console.log(" isPaymentFormValid false ");
        return false;
      }
      this.taxPaymentForm.controls.paymentType.setValue('partialPayment');
      console.log("partial payment values " + this.taxPaymentForm.value);
    }
    this.vtsService.postService(VtsService.serviceURL.taxPayment, this.taxPaymentForm.value).subscribe(response => {
      this.processPaymentResp(response);
    });

  }

  isPaymentFormValid() {
    var flag = false;
    this.errorMessage = '';
    const controls = this.taxPaymentForm.controls;
    console.log(" value " + this.taxFieldsArry[1]);
    for (const name in controls) {
      if (name == 'houseNumber' || name == 'othersKey' || name == 'taxYear' || name == 'taxId' || name == 'paymentType') {
        // console.log(name + " value " + this.taxPaymentForm.get(name).value);
      } else if (isNaN(this.taxPaymentForm.get(name).value)) {
        this.errorMessage = "దయచేసి సరైన డేటాను నమోదు చేయండి";
        console.log(" Is NAN " + name);
        return false;
      } else if (parseInt(this.taxPaymentForm.get(name).value) < 0) {
        this.errorMessage = "దయచేసి సరైన డేటాను నమోదు చేయండి";
        console.log(" value is less than 0 ");
      } else if ((parseInt(this.taxPaymentForm.get(name).value) > 0)) {
        console.log(" value is greaterthan 0  for " + name);
        flag = true;
      }
    }
    if (!flag || !this.isValuesFine()) {
      this.errorMessage = "దయచేసి సరైన డేటాను నమోదు చేయండి";
    }

    return flag;
  }

  processPaymentResp(response) {
    console.log(" payment :: reposne from server :: " + JSON.stringify(response));
    if (response.respCode == 200) {
      this.transactionPrint = response.payLoad;
      this.currentTax = this.transactionPrint.currentTax;
      this.dueTax = this.transactionPrint.dueTax;
      this.houseInfo = this.transactionPrint.houseInfo;
      this.paymentResp = 'పన్ను చెల్లింపు విజయవంతమైంది';
      this.paymentCode = 200;
    } else if (response.respCode == 400) {
      this.paymentResp = "పన్ను చెల్లింపు విఫలమైంది";
    } else if (response.respCode == 101) {
      this.paymentResp = "సాంకేతిక లోపం దయచేసి నిర్వాహకుడిని సంప్రదించండి";
    }
    $("#paymentModel").modal('hide');
    var houseObj = { "houseNum": this.houseNumber };
    this.fetchTaxDetails(houseObj);
    setTimeout(() => { this.paymentResp = ''; }, 8000);
  }

  isFormValid() {
    const controls = this.addTaxForm.controls;
    for (const name in controls) {
      if (isNaN(this.taxPaymentForm.get(name).value) || !(parseInt(this.taxPaymentForm.get(name).value) >= 0)) {
        return false;
      }
    }
    return true;
  }
  openPrint() {
    $("#responseModal").modal('hide');
    $("#printModel").modal('show');
  }
  private processResponse(response: any) {
    console.log("Comming here to close modal " + JSON.stringify(response));
    if (response.respCode == 200) {
      this.taxList = response.payLoad;
      this.addTaxResponse = 'పన్ను విజయవంతంగా జోడించబడింది';
      this.successClass = true;
    } else if (response.respCode == 400) {
      this.addTaxResponse = "పన్ను జోడించడంలో విఫలమైంది";
      this.successClass = false;
    } else if (response.respCode == 401) {
      this.addTaxResponse = "ఇప్పటికే ఈ సంవత్సరానికి పన్ను నమోదు చేయబడింది";
      this.successClass = false;
    } else if (response.respCode == 101) {
      this.addTaxResponse = "సాంకేతిక లోపం దయచేసి నిర్వాహకుడిని సంప్రదించండి";
      this.successClass = false;
    }
    $('#addTaxModal').modal('hide');
    var houseObj = { "houseNum": this.houseNumber };
    this.fetchTaxDetails(houseObj);
    setTimeout(() => { this.addTaxResponse = ''; }, 8000);
  }

  openModel(tax): void {
    this.isPayemntFormOpened = true;
    this.taxPayment = tax;
    console.log("Opening payment modal");
    $("#paymentModel").modal({
      backdrop: 'static',
      keyboard: false
    });
    $("#paymentModel").modal('show');
  }

  updateTotalTax() {
    this.resetFormInvailds();
    const controls = this.taxPaymentForm.controls;
    this.totalTaxAmt = 0;
    for (const name in controls) {
      if (!(name == 'houseNumber' || name == 'othersKey' || name == 'taxYear' || name == 'taxId')) {
        if (!isNaN(this.taxPaymentForm.get(name).value) && (parseInt(this.taxPaymentForm.get(name).value) > 0)) {
          console.log("updateTotalTax:" + name + ":totalTaxAmt =" + this.totalTaxAmt + ":currnetval=" + parseInt(this.taxPaymentForm.get(name).value));
          this.totalTaxAmt = this.totalTaxAmt + parseInt(this.taxPaymentForm.get(name).value);
          console.log("updateTotalTax:" + this.totalTaxAmt);
        }
      }
    }
    if (!this.isValuesFine()) {
      return;
    }
  }
  resetFormInvailds() {
    this.houseTaxError = false;
    this.libraryTaxError = false;
    this.lightTaxError = false;
    this.drainageTaxError = false;
    this.waterTaxError = false;
    this.kulaiNelaVariFeeError = false;
    this.kulaiDepositError = false;
    this.licenseFeeError = false;
    this.houseConstructionFeeError = false;
    this.dakhalaFeeError = false;
    this.bandhelaDoddiError = false;
    this.buildingRentsError = false;
    this.otherValueError = false;
    this.taxYearError = false;
  }

  isValuesFine() {
    const controls = this.taxPaymentForm.controls;
    for (const name in controls) {
      if (name == 'houseNumber' || name == 'othersKey' || name == 'taxYear' || name == 'taxId') {
        // console.log(name + " value " + this.taxPaymentForm.get(name).value);
      } else if (!(isNaN(this.taxPaymentForm.get(name).value) && parseInt(this.taxPaymentForm.get(name).value) > 0)) {
        console.log(" isValuesFine :" + name + ":" + this.taxPaymentForm.get(name).value + "&" + this.taxPayment.houseTax + ":" + (parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.houseTax));
        if (name == 'houseTax' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.houseTax) {
          this.houseTaxError = true;
          return false;
        } else if (name == 'libraryTax' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.libraryTax) {
          this.libraryTaxError = true;
          return false;
        } else if (name == 'lightTax' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.lightTax) {
          this.lightTaxError = true;
          return false;
        } else if (name == 'drainageTax' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.drainageTax) {
          this.drainageTaxError = true;
          return false;
        } else if (name == 'waterTax' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.waterTax) {
          this.waterTaxError = true;
          return false;
        } else if (name == 'kulaiNelaVariFee' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.kulaiNelaVariFee) {
          this.kulaiNelaVariFeeError = true;
          return false;
        } else if (name == 'kulaiDeposit' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.kulaiDeposit) {
          this.kulaiDepositError = true;
          return false;
        } else if (name == 'licenseFee' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.licenseFee) {
          this.licenseFeeError = true;
          return false;
        } else if (name == 'houseConstructionFee' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.houseConstructionFee) {
          this.houseConstructionFeeError = true;
          return false;
        } else if (name == 'dakhalaFee' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.dakhalaFee) {
          this.dakhalaFeeError = true;
          return false;
        } else if (name == 'bandhelaDoddi' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.bandhelaDoddi) {
          this.bandhelaDoddiError = true;
          return false;
        } else if (name == 'buildingRents' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.buildingRents) {
          this.buildingRentsError = true;
          return false;
        } else if (name == 'otherValue' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.otherValue) {
          this.otherValueError = true;
          return false;
        } else if (name == 'taxYear' && parseInt(this.taxPaymentForm.get(name).value) > this.taxPayment.taxYear) {
          this.taxYearError = true;
          return false;
        }
      }
    }
    return true;
  }



  closeMe() {
    $("#paymentModel").modal('hide');
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  selectPayment(payemntType) {
    if (payemntType == 'totalPayment') {
      this.totalPayment = true;
      this.partialPayment = false;
    } else if (payemntType == 'partialPayment') {
      this.totalPayment = false;
      this.partialPayment = true;
    }
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  initAddForms() {
    console.log(" tax form loaded ");
    this.addTaxForm = new FormGroup({
      taxId: new FormControl(''),
      houseNumber: new FormControl(''),
      houseTax: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(4)]),
      libraryTax: new FormControl('', [Validators.required]),
      lightTax: new FormControl('', [Validators.required]),
      drainageTax: new FormControl('', [Validators.required]),
      waterTax: new FormControl('', [Validators.required]),
      kulaiNelaVariFee: new FormControl('', [Validators.required]),
      kulaiDeposit: new FormControl('', [Validators.required]),
      licenseFee: new FormControl('', [Validators.required]),
      houseConstructionFee: new FormControl('', [Validators.required]),
      dakhalaFee: new FormControl('', [Validators.required]),
      bandhelaDoddi: new FormControl('', [Validators.required]),
      buildingRents: new FormControl('', [Validators.required]),
      othersKey: new FormControl('', [Validators.required]),
      otherValue: new FormControl('', [Validators.required]),
      taxYear: new FormControl('', [Validators.required])
    });
  }

  initEditForms() {
    console.log(" tax form loaded ");
    this.editTaxForm = new FormGroup({
      houseNumber: new FormControl(''),
      houseTax: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(4)]),
      libraryTax: new FormControl('', [Validators.required]),
      lightTax: new FormControl('', [Validators.required]),
      drainageTax: new FormControl('', [Validators.required]),
      waterTax: new FormControl('', [Validators.required]),
      kulaiNelaVariFee: new FormControl('', [Validators.required]),
      kulaiDeposit: new FormControl('', [Validators.required]),
      licenseFee: new FormControl('', [Validators.required]),
      houseConstructionFee: new FormControl('', [Validators.required]),
      dakhalaFee: new FormControl('', [Validators.required]),
      bandhelaDoddi: new FormControl('', [Validators.required]),
      buildingRents: new FormControl('', [Validators.required]),
      othersKey: new FormControl('', [Validators.required]),
      otherValue: new FormControl('', [Validators.required]),
      taxYear: new FormControl('', [Validators.required])
    });
  }


  initPayForms() {
    console.log(" Payment form loaded ");
    this.taxPaymentForm = new FormGroup({
      houseNumber: new FormControl(''),
      houseTax: new FormControl(0, [Validators.required]),
      libraryTax: new FormControl(0, [Validators.required]),
      lightTax: new FormControl(0, [Validators.required]),
      drainageTax: new FormControl(0, [Validators.required]),
      waterTax: new FormControl(0, [Validators.required]),
      kulaiNelaVariFee: new FormControl(0, [Validators.required]),
      kulaiDeposit: new FormControl(0, [Validators.required]),
      licenseFee: new FormControl(0, [Validators.required]),
      houseConstructionFee: new FormControl(0, [Validators.required]),
      dakhalaFee: new FormControl(0, [Validators.required]),
      bandhelaDoddi: new FormControl(0, [Validators.required]),
      buildingRents: new FormControl(0, [Validators.required]),
      othersKey: new FormControl(0, [Validators.required]),
      otherValue: new FormControl(0, [Validators.required]),
      taxYear: new FormControl(0, [Validators.required]),
      totalTax: new FormControl(0, [Validators.required]),
      transactionDate: new FormControl(0, [Validators.required]),
      taxId: new FormControl(0),
      paymentType: new FormControl('')
    });
  }

  generateTax() {
    var houseObj = { "houseNum": this.houseNumber };
    console.log(" Request object " + JSON.stringify(houseObj));
    this.vtsService.postService(VtsService.serviceURL.fetchPrevTax, houseObj).subscribe(response => {
      //console.log("print tax " + response.payLoad.houseTax);
      this.prevTaxList = response.payLoad;
      console.log("previous tax values :: " + JSON.stringify(this.prevTaxList));
      if (response.respCode == 200) {
        this.isTaxAvailable = true;
      } else if (response.respCode == 201) {
        this.isEmptyTax = true;
      }

    })
  }
  editTax(tax) {
    console.log(" Edit tax ");
    this.editTaxVal = tax;
    console.log(" Edit tax values " + JSON.stringify(tax))
  }

  openTransactionPage() {
    localStorage.setItem("hno", this.houseNumber);
    this.router.navigateByUrl("/transaction");
  }




}

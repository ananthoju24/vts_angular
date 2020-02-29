import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { VtsService } from '../vts.service';
import { VtsdataserviceService } from '../vtsdataservice.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

  auditForm: FormGroup;
  today = new Date();
  fromToday = new Date();
  toToday = new Date();
  transactionsList: any = [];
  transactionsAvailable: boolean = false;
  showPrintOption : boolean = false;
  isAuditSubmitted : boolean = false;

  constructor(private vtsDataService: VtsdataserviceService, private vtsService: VtsService, private fromBuilder: FormBuilder) {
    this.today.setDate(this.today.getDate());
    this.fromToday.setDate(this.fromToday.getDate());
    this.toToday.setDate(this.toToday.getDate());
  }

  ngOnInit() {
    this.initAuditForms();
  }

  audit() {
    this.isAuditSubmitted = true;
    this.vtsService.getService(VtsService.serviceURL.fetchTransactionsByDate + "/" + this.auditForm.value.fromDate + "/" + this.auditForm.value.toDate).subscribe(response => {
      this.transactionsList = response.payLoad;
      console.log("transactions  :: " + JSON.stringify(this.transactionsList));
      if (response.respCode == 200) {
        this.transactionsAvailable = true;
        this.showPrintOption = true;
      } else if (response.respCode == 201) {
        this.transactionsAvailable = false;
      }
      console.log(" response " + this.transactionsList);
    })
  }


  initAuditForms() {
    console.log(" Payment form loaded ");
    this.auditForm = new FormGroup({
      fromDate: new FormControl(0, [Validators.required]),
      toDate: new FormControl(0, [Validators.required])
    });
  }

}

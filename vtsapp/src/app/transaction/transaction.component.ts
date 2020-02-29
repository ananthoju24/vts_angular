import { Component, OnInit } from '@angular/core';
import { VtsService } from '../vts.service';
import { VtsdataserviceService } from '../vtsdataservice.service';
declare var $: any;
@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  constructor(private vtsService: VtsService) { }

  houseNumber: any;
  tranList: any;
  resultMap: any;
  transactionPrint: any;
  currentTax: any;
  dueTax: any;
  houseInfo: any;
  showPopup: boolean = false;
  isCallFromHead: boolean = false;
  cancelationMsg: any = '';

  ngOnInit() {
    this.houseNumber = localStorage.getItem("hno");
    console.log(" houseNumber " + this.houseNumber);
    var houseObj = { "houseNum": this.houseNumber };
    this.fetchTransaction(houseObj);
  }

  fetchTransaction(house) {
    console.log("fetching");
    this.vtsService.postService(VtsService.serviceURL.fetchTransaction, house).subscribe(response => {
      if (response.respCode == 200) {
        this.tranList = response.payLoad;
      }
    })
  }
  printModel(transactionID) {
    this.vtsService.getService(VtsService.serviceURL.fetch + "/" + transactionID).subscribe(response => {
      if (response.respCode == 200) {
        this.transactionPrint = response.payLoad;
        this.currentTax = this.transactionPrint.currentTax;
        this.dueTax = this.transactionPrint.dueTax;
        this.houseInfo = this.transactionPrint.houseInfo;
        console.log("transactionPrint " + JSON.stringify(this.transactionPrint));
      }
    })
    $("#printModel").modal('show');
  }

  cancelTran(tranID) {
    console.log("cancel treans "+tranID);
    this.vtsService.getService(VtsService.serviceURL.cancelTransaction + tranID).subscribe(response => {
      if (response.respCode == 200) {
        this.cancelationMsg = "లావాదేవీ రద్దు చేయబడింది";
       // alert("లావాదేవీ రద్దు చేయబడింది");
        //window.location.reload();
      } else {
        this.cancelationMsg = "లావాదేవీ రద్దు చేయడం విఫలమైంది";
        //alert("లావాదేవీ రద్దు చేయడం విఫలమైంది");
      }
    })
    setTimeout(() => { this.cancelationMsg = ''; }, 8000);
    var houseObj = { "houseNum": this.houseNumber };
    this.fetchTransaction(houseObj);
    console.log(this.cancelationMsg);
    window.location.reload();
  }
}

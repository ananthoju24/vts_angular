import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VtsdataserviceService {

  constructor() { }
  currentHouseNumber : String = '';
  isCallFromHead : boolean = false;

  setHouseNumber(hnumeber : string){
    this.currentHouseNumber = hnumeber;
  }

  getCurrentHouseNumber(){
    return this.currentHouseNumber;
  }
}

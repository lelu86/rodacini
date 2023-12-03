import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantatService {

  sendMessage = new BehaviorSubject('neplantat');

  constructor() { }

  communicateMessage(msg: any) {
    this.sendMessage.next(msg);
  }

}

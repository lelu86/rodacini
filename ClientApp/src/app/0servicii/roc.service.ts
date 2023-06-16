import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RocService {

  sendMessage = new BehaviorSubject('radacina');

  constructor() { }

  communicateMessage(msg: any) {
    this.sendMessage.next(msg);
  }

}

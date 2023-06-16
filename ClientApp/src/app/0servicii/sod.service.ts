import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'//"make sure its providedIn root, so there will be only 1 instance""
})
export class SodService {

  sendMessage = new BehaviorSubject('dreptaci');

  constructor() { }

  communicateMessage(msg: any) {
    this.sendMessage.next(msg);
  }

}

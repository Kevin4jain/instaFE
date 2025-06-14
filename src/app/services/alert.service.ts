import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {
  message = '';

  setMessage(msg: string) {
    this.message = msg;
  }

  getMessage() {
    return this.message;
  }
}

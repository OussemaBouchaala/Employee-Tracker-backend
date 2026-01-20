import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NotificationService {
   private events$ = new Subject<MessageEvent>();

  emit(data: MessageEvent) {
    this.events$.next({data} as MessageEvent); 
  }

  stream(): Observable<MessageEvent> {
    return this.events$.asObservable();
  }
}

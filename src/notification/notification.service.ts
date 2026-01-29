import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { Event } from 'src/config/interfaces/event';

@Injectable()
export class NotificationService {
   private events$ = new Subject<string>();
    private streams: Map<string, Subject<Event>> = new Map();


  getStream(candidateId: string): Observable<Event> {
    if (!this.streams.has(candidateId)) {
      this.streams.set(candidateId, new Subject<Event>());
    }

    return this.streams.get(candidateId)!.asObservable();
  }


  notifyCandidate(candidateId: string, payload: string) {
    if (!this.streams.has(candidateId)) {
      this.streams.set(candidateId, new Subject<Event>());
    }
    const stream = this.streams.get(candidateId);
    if (stream) {
      stream.next({ data: payload, name: 'notification' });
    }
  }

  emit(data: string) {
    this.events$.next(data); 
  }

  stream(): Observable<string> {
    return this.events$.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AuthModalTab = 'login' | 'register';

@Injectable({ providedIn: 'root' })
export class AuthModalService {
  private openSubject = new BehaviorSubject<AuthModalTab | null>(null);
  open$ = this.openSubject.asObservable();

  open(tab: AuthModalTab = 'login') {
    this.openSubject.next(tab);
  }

  close() {
    this.openSubject.next(null);
  }
}

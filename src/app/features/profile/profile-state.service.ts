import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileStateService {
  private activeTab$ = new BehaviorSubject<'userInfo' | 'tickets'>('userInfo');
  private isLoading$ = new BehaviorSubject<boolean>(true);

  getActiveTab() {
    return this.activeTab$.asObservable();
  }

  setActiveTab(tab: 'userInfo' | 'tickets') {
    this.activeTab$.next(tab);
  }

  getIsLoading() {
    return this.isLoading$.asObservable();
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading$.next(isLoading);
  }
}

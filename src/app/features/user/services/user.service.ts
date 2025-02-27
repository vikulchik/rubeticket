import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../../../core/interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser$ = new BehaviorSubject<IUser | null>(null);

  setUser(user: IUser): void {
    this.currentUser$.next(user);
  }

  getUser(): Observable<IUser | null> {
    return this.currentUser$.asObservable();
  }

  clearUser(): void {
    this.currentUser$.next(null);
  }
}

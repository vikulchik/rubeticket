import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { IProfile } from './profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.API_URL;

  getProfile(): Observable<IProfile> {
    return this.http.get<IProfile>(`${this.apiUrl}account`).pipe(
      catchError((error) => {
        return throwError(() => new Error(error?.error?.message || 'Account not found'));
      })
    );
  }

  updateProfileDetails(field: keyof IProfile, value: any): Observable<IProfile> {
    let formattedValue = value;
    if (field === 'birthday' && typeof value === 'string' && !value.includes('T')) {
      formattedValue = new Date(value).toISOString(); // Отправляем в формате ISO для API
    }
    return this.http.patch<IProfile>(`${this.apiUrl}account`, { [field]: formattedValue });
  }

  uploadPhoto(file: File): Observable<{ photoUrl: string }> {
    const formData = new FormData();
    formData.append('photo', file, file.name);
    return this.http.post<{ photoUrl: string }>(`${this.apiUrl}account/photo`, formData);
  }

  updatePhotoProfile(profile: IProfile): Observable<IProfile> {
    return this.http.put<IProfile>(`${this.apiUrl}account/photo`, profile);
  }
}

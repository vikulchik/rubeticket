import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.API_URL;

  getTickets(): Observable<{ id: number; event: string; date: string }[]> {
    return this.http
      .get<{ id: number; event: string; date: string }[]>(`${this.apiUrl}account/tickets`)
      .pipe
      // Здесь можно добавить catchError, если нужно
      ();
  }
}

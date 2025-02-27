import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface ISlide {
  imgSrc: string;
  title?: string;
  date?: Date;
}

@Injectable({ providedIn: 'root' })
export class EventSliderService {
  getSliderItems(): Observable<ISlide[]> {
    return of([
      {
        imgSrc: 'assets/images/epica.jpg',
        title: 'Epica',
        date: new Date('2025-07-16'),
      },
      {
        imgSrc: 'assets/images/imagine-dragons.png',
        title: 'Imagine Dragons',
        date: new Date('2025-07-16'),
      },
    ]);
  }
}

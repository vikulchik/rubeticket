import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SliderStateService {
  private currentSlide$ = new BehaviorSubject<number>(0);
  private destroy$ = new Subject<void>();
  private autoPlayEnabled = true;
  private intervalTime = 2000;

  constructor() {}

  getCurrentSlide() {
    return this.currentSlide$.asObservable();
  }

  setCurrentSlide(index: number) {
    this.currentSlide$.next(index);
  }

  startAutoPlay(totalSlides: number) {
    if (!this.autoPlayEnabled) return;

    interval(this.intervalTime)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.nextSlide(totalSlides))
      )
      .subscribe();
  }

  stopAutoPlay() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  nextSlide(totalSlides: number) {
    const newIndex = (this.currentSlide$.value + 1) % totalSlides;
    this.setCurrentSlide(newIndex);
  }

  prevSlide(totalSlides: number) {
    const newIndex = (this.currentSlide$.value - 1 + totalSlides) % totalSlides;
    this.setCurrentSlide(newIndex);
  }

  // toggleAutoPlay(enabled: boolean) {
  //   this.autoPlayEnabled = enabled;
  //   if (enabled) {
  //     this.startAutoPlay(this.getCurrentSlide().value);
  //   } else {
  //     this.stopAutoPlay();
  //   }
  // }
}

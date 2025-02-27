import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { EventSliderService } from './event-slider.service';
import { SliderStateService } from './slider-state.service';

interface ISlide {
  imgSrc: string;
  title?: string;
  date?: Date;
}

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  imports: [AsyncPipe, NgForOf, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {
  private sliderStateService = inject(SliderStateService);
  private eventSliderService = inject(EventSliderService);

  private subscription: Subscription = new Subscription();

  @ViewChild('sliderContainer') sliderContainer!: ElementRef;

  slides: ISlide[] = [];
  currentSlide: number = 0;

  ngOnInit() {
    this.eventSliderService.getSliderItems().subscribe((items: ISlide[]) => {
      this.slides = items;
    });
  }

  ngAfterViewInit() {
    this.sliderStateService.startAutoPlay(this.slides.length);
    this.subscribeToSlideChanges();
    this.updateTransform();
  }

  ngOnDestroy() {
    this.sliderStateService.stopAutoPlay();
    this.subscription.unsubscribe();
  }

  private subscribeToSlideChanges() {
    this.subscription = this.sliderStateService.getCurrentSlide().subscribe((index: number) => {
      this.currentSlide = index;
      this.updateTransform();
    });
  }

  updateTransform() {
    if (this.sliderContainer && this.sliderContainer.nativeElement) {
      const translateX = -this.currentSlide * 100;
      this.sliderContainer.nativeElement.style.transform = `translateX(${translateX}%)`;
    }
  }

  nextSlide() {
    this.sliderStateService.nextSlide(this.slides.length);
  }

  prevSlide() {
    this.sliderStateService.prevSlide(this.slides.length);
  }
}

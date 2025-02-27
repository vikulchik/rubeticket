import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared';
import { FooterComponent } from '../../../shared';
import { SliderComponent } from '../../../shared';
import { ButtonComponent } from '../../../shared';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SliderComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  buyTickets() {
    console.log('Buy Tickets clicked!');
    // Логика покупки билетов
  }
}

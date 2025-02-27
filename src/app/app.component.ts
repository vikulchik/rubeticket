import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FieldComponent } from './shared/components/field/field.component';
import { MatButton } from '@angular/material/button';
import { ButtonComponent } from './shared/components/button/button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FieldComponent, MatButton, ButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
  isDarkMode = false;
  constructor(private renderer: Renderer2) {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
}

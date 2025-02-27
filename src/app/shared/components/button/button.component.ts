import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButton],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() type: string = '';
  @Input() text: string = '';
  @Input() disabled!: boolean;

  @Output() click = new EventEmitter<Event>();

  onClick(event: Event): void {
    this.click.emit(event);
  }
}

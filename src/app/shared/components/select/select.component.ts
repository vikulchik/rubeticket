import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

interface Option {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgIf],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label?: string = '';
  @Input() id: string = '';
  @Input() options: Option[] = [];
  @Input() control: AbstractControl | null = null;
  @Output() blur = new EventEmitter<Event>(); // Событие для потери фокуса
  @Output() enter = new EventEmitter<Event>(); // Событие для Enter

  value: any = '';
  touched: boolean = false;
  constructor() {}

  onChange: any = () => {};
  onTouched: any = () => {};

  onBlur(event: Event): void {
    this.touched = true;
    this.onTouched();
    this.blur.emit(event); // Передаём событие blur наружу
  }

  onEnter(event: Event): void {
    this.enter.emit(event); // Передаём событие Enter наружу
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value || '';
  }
}

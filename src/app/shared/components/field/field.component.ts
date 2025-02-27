import { Component, Input, forwardRef, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-field',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgIf],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldComponent),
      multi: true,
    },
  ],
})
export class FieldComponent implements ControlValueAccessor {
  @Input() label?: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() control: AbstractControl | null = null;
  @Input() ngModel: any;
  @Output() ngModelChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<Event>(); // Событие для потери фокуса
  @Output() enter = new EventEmitter<Event>(); // Событие для Enter

  value: any = '';
  isDisabled: boolean = false;
  touched: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
    this.ngModelChange.emit(this.value); // Уведомляем о изменении через ngModel
  }

  onBlur(event: Event): void {
    this.touched = true;
    this.onTouched();
    this.blur.emit(event); // Передаём событие blur наружу
  }

  onEnter(event: Event): void {
    this.enter.emit(event); // Передаём событие Enter наружу
  }

  getControlErrors(): string[] {
    if (this.control && this.control.errors && (this.control.touched || this.control.dirty || this.touched)) {
      return Object.keys(this.control.errors);
    }
    return [];
  }
}

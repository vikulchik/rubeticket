import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldComponent } from '../field/field.component';
import { NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-editable-field',
  templateUrl: 'editable-field.component.html',
  styleUrl: './editable-field.component.scss',
  standalone: true,
  imports: [FormsModule, FieldComponent, NgIf, NgForOf, ReactiveFormsModule, SelectComponent, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableFieldComponent {
  @Input() title: string = '';
  @Input() value: string | Date | null = null;
  @Input() type: 'text' | 'select' | 'date' | 'email' = 'text';
  @Input() options: { value: string; label: string }[] = [];
  @Output() valueChange = new EventEmitter<{ field: string; value: any }>();

  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('selectInput') selectInput!: ElementRef<HTMLSelectElement>;

  isEditing = false;

  startEditing() {
    this.isEditing = true;
    setTimeout(() => {
      let input: HTMLElement | null = null;
      switch (this.type) {
        case 'text':
          input = this.textInput?.nativeElement;
          break;
        case 'email':
          input = this.emailInput?.nativeElement;
          break;
        case 'date':
          input = this.dateInput?.nativeElement;
          break;
        case 'select':
          input = this.selectInput?.nativeElement;
          break;
      }
      if (input) {
        input.focus();
      }
    }, 0);
  }

  stopEditing() {
    this.isEditing = false;
    // Форматируем value перед эмитом, чтобы гарантировать простое значение
    let formattedValue: string | Date | null = this.value;
    if (this.type === 'date' && typeof this.value === 'string') {
      formattedValue = new Date(this.value).toISOString().split('T')[0]; // Форматируем дату как "YYYY-MM-DD"
    } else if (this.value && typeof this.value !== 'string') {
      formattedValue = String(this.value); // Конвертируем в строку, если это не строка
    }
    this.valueChange.emit({ field: this.title.toLowerCase(), value: formattedValue });
  }
}

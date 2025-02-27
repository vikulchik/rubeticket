import { Component } from '@angular/core';
import { FieldComponent } from '../field/field.component';
import { NgIf } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FieldComponent, NgIf, ButtonComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {}

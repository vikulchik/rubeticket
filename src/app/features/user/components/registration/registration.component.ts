import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FieldComponent } from '../../../../shared/components/field/field.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ICredentials } from '../../../../core/interfaces/auth.interface';
import { GENDER_OPTIONS } from '../../../../shared/config/gender-options';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FieldComponent, ReactiveFormsModule, SelectComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  registerForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    firstName: new FormControl<string>('', [Validators.required]),
    lastName: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    gender: new FormControl<string>('male', [Validators.required]),
    birthday: new FormControl<string>('', [Validators.required]),
  });

  genders = GENDER_OPTIONS;

  register(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        const ctrl = this.registerForm.get(key);
        ctrl?.markAsTouched();
        ctrl?.markAsDirty();
        ctrl?.updateValueAndValidity();
      });
      return;
    }
    this.authService.register(this.registerForm.value as ICredentials).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (error) => console.error('Login failed:', error),
    });
  }

  getFormControl(name: string): FormControl<any> {
    return this.registerForm.get(name) as FormControl<any>;
  }

  protected readonly Validators = Validators;
}

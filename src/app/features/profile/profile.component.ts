import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from './profile.service';
import { Gender, IProfile } from './profile.interface';
import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, inject } from '@angular/core';
import { ButtonComponent, EditableFieldComponent, FooterComponent, HeaderComponent } from '../../shared';
import { ProfileStateService } from './profile-state.service';
import { TicketService } from './ticket.service';
import { GENDER_OPTIONS } from '../../shared/config/gender-options';
import { DateUtils } from '../../shared/utils/date.utils';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    EditableFieldComponent,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private profileService = inject(ProfileService);
  private profileState = inject(ProfileStateService);
  private ticketService = inject(TicketService);
  private subscription: Subscription = new Subscription();
  private cdr = inject(ChangeDetectorRef);

  profile: IProfile = { firstName: '', lastName: '', birthday: '', gender: Gender.Male, email: '', photoUrl: '' };
  tickets: { id: number; event: string; date: string }[] = [];
  defaultPhoto = 'assets/images/default-avatar.jpg';
  selectedImage: string | null = null;
  genders = GENDER_OPTIONS;
  photoUploadInProgress = false;
  isLoading: boolean = true;
  activeTab: 'userInfo' | 'tickets' = 'userInfo';

  constructor() {}

  ngOnInit() {
    this.subscription.add(
      this.profileState.getIsLoading().subscribe((isLoading) => {
        this.isLoading = isLoading;
        this.cdr.markForCheck();
      })
    );
    this.subscription.add(
      this.profileState.getActiveTab().subscribe((tab) => {
        this.activeTab = tab;
        this.cdr.markForCheck();
      })
    );

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = this.formatProfile(profile);
        this.selectedImage = profile.photoUrl || null;
        this.profileState.setIsLoading(false);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Ошибка при получении профиля:', error.message);
        this.profileState.setIsLoading(false);
        this.profile = { firstName: '', lastName: '', birthday: '', gender: Gender.Male, email: '', photoUrl: '' };
        this.cdr.markForCheck();
      },
    });

    // TODO:Загрузка билетов (временно отключим, если бэкенд не готов)
    // this.ticketService.getTickets().subscribe({
    //   next: (tickets) => {
    //     this.tickets = tickets;
    //   },
    //   error: (error) => {
    //     console.error('Ошибка при получении билетов:', error.message);
    //     this.tickets = []; // Устанавливаем пустой массив при ошибке
    //   },
    // });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.selectedImage) {
      URL.revokeObjectURL(this.selectedImage);
    }
  }

  private formatProfile(profile: IProfile): IProfile {
    let formattedProfile = { ...profile };
    if (formattedProfile.birthday && typeof formattedProfile.birthday === 'string') {
      formattedProfile.birthday = DateUtils.formatToDateOnly(formattedProfile.birthday);
    }
    return formattedProfile;
  }

  private formatDate(dateStr: string): string {
    if (!dateStr.includes('T')) {
      return new Date(dateStr).toISOString().split('T')[0];
    }
    return dateStr.split('T')[0];
  }

  updateProfile(event: { field: string; value: string | Date | null }) {
    const field = event.field as keyof IProfile;
    const value = event.value;

    console.log('Updating field:', field, 'with value:', value);

    let formattedValue = value;
    if (field === 'birthday' && typeof value === 'string') {
      formattedValue = new Date(value).toISOString().split('T')[0]; // Форматируем дату
    } else if (value && typeof value !== 'string') {
      formattedValue = String(value); // Конвертируем в строку, если это не строка
    }

    this.profileService.updateProfileDetails(field, formattedValue).subscribe({
      next: (updatedProfile) => {
        this.profile = this.formatProfile(updatedProfile);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error(`Ошибка при обновлении ${field}:`, error);
        alert(`Failed to update ${field}. Please try again.`);
      },
    });
  }

  setActiveTab(tab: 'userInfo' | 'tickets') {
    this.profileState.setActiveTab(tab);
  }

  onUploadPhotoClick() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('The file is too large. Maximum size is 5 MB.');
        return;
      }
      this.previewImage(file);
      // this.uploadPhoto(file);
    }
  }

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const blob = new File([reader.result as ArrayBuffer], file.name, { type: file.type });
      this.selectedImage = URL.createObjectURL(blob);
      this.cdr.markForCheck();
    };
    reader.readAsArrayBuffer(file);
  }

  private uploadPhoto(file: File) {
    this.photoUploadInProgress = true;
    this.profileService.uploadPhoto(file).subscribe({
      next: (response) => {
        this.selectedImage = response.photoUrl;
        this.profile.photoUrl = response.photoUrl;
        this.profileService.updatePhotoProfile(this.profile).subscribe({
          next: (updatedProfile) => {
            this.profile = this.formatProfile(updatedProfile);
            this.photoUploadInProgress = false;
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.photoUploadInProgress = false;
          },
        });
      },
      error: (error) => {
        console.error('Error uploading photo:', error);
        this.photoUploadInProgress = false;
        alert('Failed to upload photo. Please try again.');
      },
    });
  }
}

import { Component, inject } from '@angular/core';
import { LocalStorageService } from '../../../core/services/localstorage.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private localStorage = inject(LocalStorageService);
  private authService = inject(AuthService);

  isLoggedIn: boolean = false;

  logout() {
    console.log('logout');
    this.authService.logout();
  }

  ngOnInit() {
    this.isLoggedIn = !!this.localStorage.get('isLoggedIn');
  }
}

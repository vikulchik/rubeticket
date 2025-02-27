import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, Observable } from 'rxjs';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['auth/login'], {
          queryParams: { returnUrl: state.url }, // Сохраняем текущий URL
        });
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['auth/login'], {
        queryParams: { returnUrl: state.url },
      });
      return of(false);
    })
  );
};

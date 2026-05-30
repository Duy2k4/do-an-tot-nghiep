import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthModalService } from '../services/auth-modal.service';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const authModal = inject(AuthModalService);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/']);
  authModal.open('login');
  return false;
};

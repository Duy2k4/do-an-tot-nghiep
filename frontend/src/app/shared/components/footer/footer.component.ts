import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthModalService } from '../../../core/services/auth-modal.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  constructor(private authModal: AuthModalService) {}

  openLogin() {
    this.authModal.open('login');
  }
}

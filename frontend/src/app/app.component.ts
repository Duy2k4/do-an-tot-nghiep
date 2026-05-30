import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ChatbotWidgetComponent } from './shared/components/chatbot-widget/chatbot-widget.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

import { AuthModalComponent } from './shared/components/auth-modal/auth-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, ChatbotWidgetComponent, AuthModalComponent, ConfirmDialogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isAdminRoute = this.router.url.startsWith('/admin');
    });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
      this.isAdminRoute = this.router.url.startsWith('/admin');
    });
  }
}

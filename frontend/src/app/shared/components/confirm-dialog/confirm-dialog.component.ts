import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmDialogOptions, ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  options: ConfirmDialogOptions | null = null;

  constructor(private confirmDialog: ConfirmDialogService) {
    this.confirmDialog.options$.subscribe(options => {
      this.options = options;
      document.body.style.overflow = options ? 'hidden' : '';
    });
  }

  cancel() {
    this.confirmDialog.close(false);
  }

  confirm() {
    this.confirmDialog.close(true);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmDialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private resolver: ((value: boolean) => void) | null = null;
  readonly options$ = new BehaviorSubject<ConfirmDialogOptions | null>(null);

  confirm(options: ConfirmDialogOptions = {}): Promise<boolean> {
    this.options$.next({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa mục này? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      icon: 'delete',
      ...options
    });

    return new Promise(resolve => {
      this.resolver = resolve;
    });
  }

  close(result: boolean) {
    this.options$.next(null);
    this.resolver?.(result);
    this.resolver = null;
  }
}

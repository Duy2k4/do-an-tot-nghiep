import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ConfirmDialogService } from '../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  destCategories: any[] = [];
  artCategories: any[] = [];
  activeTab: 'destinations' | 'articles' = 'destinations';
  newDestCat = '';
  newArtCat = '';
  fieldErrors: Record<string, string> = {};
  error = '';
  loading = true;

  constructor(private api: ApiService, private confirmDialog: ConfirmDialogService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.api.getDestinationCategories().subscribe({
      next: d => { this.destCategories = d; },
      error: () => { this.error = 'Không thể tải danh mục điểm đến'; }
    });
    this.api.getArticleCategories().subscribe({
      next: d => { this.artCategories = d; this.loading = false; },
      error: () => { this.error = 'Không thể tải danh mục bài viết'; this.loading = false; }
    });
  }

  add(type: string) {
    const name = type === 'destinations' ? this.newDestCat : this.newArtCat;
    const key = type === 'destinations' ? 'newDestCat' : 'newArtCat';
    const existing = type === 'destinations' ? this.destCategories : this.artCategories;
    const trimmedName = name.trim();
    this.fieldErrors[key] = '';
    this.error = '';

    if (!trimmedName) {
      this.fieldErrors[key] = 'Vui lòng nhập tên danh mục';
      return;
    }
    if (trimmedName.length < 2) {
      this.fieldErrors[key] = 'Tên danh mục ít nhất 2 ký tự';
      return;
    }
    if (existing.some(c => String(c.name).toLowerCase() === trimmedName.toLowerCase())) {
      this.fieldErrors[key] = 'Danh mục này đã tồn tại';
      return;
    }

    const slug = trimmedName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const request = type === 'destinations'
      ? this.api.createDestinationCategory({ name: trimmedName, slug })
      : this.api.createArticleCategory({ name: trimmedName, slug });

    request.subscribe({
      next: category => {
        if (type === 'destinations') {
          this.destCategories = [...this.destCategories, category];
          this.newDestCat = '';
        } else {
          this.artCategories = [...this.artCategories, category];
          this.newArtCat = '';
        }
      },
      error: err => {
        this.error = err.error?.error || 'Không thể thêm danh mục';
      }
    });
  }

  async delete(type: string, id: string) {
    const category = type === 'destinations'
      ? this.destCategories.find(c => c.id === id)
      : this.artCategories.find(c => c.id === id);
    const count = type === 'destinations'
      ? category?._count?.destinations || 0
      : category?._count?.articles || 0;

    if (count > 0) {
      this.error = 'Không thể xóa danh mục đang có nội dung. Vui lòng chuyển hoặc xóa các mục liên quan trước.';
      return;
    }

    const confirmed = await this.confirmDialog.confirm({
      message: `Bạn có chắc muốn xóa danh mục "${category?.name || 'này'}"?`
    });
    if (!confirmed) return;

    const request = type === 'destinations'
      ? this.api.deleteDestinationCategory(id)
      : this.api.deleteArticleCategory(id);

    request.subscribe({
      next: () => {
        if (type === 'destinations') {
          this.destCategories = this.destCategories.filter(c => c.id !== id);
        } else {
          this.artCategories = this.artCategories.filter(c => c.id !== id);
        }
        this.error = '';
      },
      error: err => {
        this.error = err.error?.error || 'Không thể xóa danh mục';
      }
    });
  }
}

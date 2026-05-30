import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-destination-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './destination-form.component.html'
})
export class DestinationFormComponent implements OnInit {
  isEdit = false;
  form: any = { isFeatured: false, isActive: true };
  provinces: any[] = [];
  provinceLoading = false;
  categories: any[] = [];
  loading = false;
  uploading = false;
  error = '';
  fieldErrors: Record<string, string> = {};
  private slugEditedManually = false;

  images: { url: string; caption: string; file?: File; preview?: string }[] = [];

  constructor(public api: ApiService, private route: ActivatedRoute, private router: Router) {}

  private isBlank(value: unknown): boolean {
    return String(value ?? '').trim().length === 0;
  }

  private isValidSlug(value: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  }

  private generateSlug(value: string): string {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  onNameChange(value: string) {
    if (!this.slugEditedManually || this.isBlank(this.form.slug)) {
      this.form.slug = this.generateSlug(value);
      this.slugEditedManually = false;
    }
  }

  onSlugChange(value: string) {
    this.form.slug = this.generateSlug(value);
    this.slugEditedManually = !this.isBlank(this.form.slug);
  }

  private loadProvinces() {
    this.provinceLoading = true;

    this.api.syncExternalProvinces().subscribe({
      next: (provinces) => {
        this.provinces = Array.isArray(provinces)
          ? provinces.map((province: any) => ({ ...province, displayName: province.name }))
          : [];
        this.provinceLoading = false;
      },
      error: () => {
        this.api.getProvinces().subscribe({
          next: (provinces) => {
            this.provinces = Array.isArray(provinces)
              ? provinces.map((province: any) => ({ ...province, displayName: province.name }))
              : [];
            this.provinceLoading = false;
          },
          error: () => {
            this.provinces = [];
            this.provinceLoading = false;
          }
        });
      }
    });
  }

  validateForm(): boolean {
    this.fieldErrors = {};

    if (this.isBlank(this.form.name)) {
      this.fieldErrors['name'] = 'Vui lòng nhập tên điểm đến';
    } else if (String(this.form.name).trim().length < 2) {
      this.fieldErrors['name'] = 'Tên điểm đến ít nhất 2 ký tự';
    }

    if (this.isBlank(this.form.slug)) {
      this.fieldErrors['slug'] = 'Vui lòng nhập slug';
    } else if (!this.isValidSlug(String(this.form.slug).trim())) {
      this.fieldErrors['slug'] = 'Slug chỉ gồm chữ thường, số và dấu gạch ngang';
    }

    if (this.isBlank(this.form.provinceId)) {
      this.fieldErrors['provinceId'] = 'Vui lòng chọn tỉnh/thành';
    }

    if (this.isBlank(this.form.categoryId)) {
      this.fieldErrors['categoryId'] = 'Vui lòng chọn danh mục';
    }

    if (this.isBlank(this.form.address)) {
      this.fieldErrors['address'] = 'Vui lòng nhập địa chỉ';
    }

    if (this.isBlank(this.form.description)) {
      this.fieldErrors['description'] = 'Vui lòng nhập mô tả chi tiết';
    } else if (String(this.form.description).trim().length < 20) {
      this.fieldErrors['description'] = 'Mô tả chi tiết ít nhất 20 ký tự';
    }

    return Object.keys(this.fieldErrors).length === 0;
  }

  private focusFirstInvalidField() {
    setTimeout(() => {
      const firstInvalid = document.querySelector<HTMLElement>('.is-invalid');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid?.focus?.();
    });
  }

  ngOnInit() {
    this.loadProvinces();
    this.api.getDestinationCategories().subscribe(d => { this.categories = d; });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.api.getDestination(id).subscribe(d => {
        this.form = { ...d };
        if (d.images && d.images.length > 0) {
          this.images = d.images.map((img: any) => ({
            url: img.url,
            caption: img.caption || '',
          }));
        }
      });
    }
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.images.push({
              url: '',
              caption: '',
              file: file,
              preview: e.target.result
            });
          };
          reader.readAsDataURL(file);
        }
      }
    }
    event.target.value = '';
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  setPrimary(index: number) {
    const image = this.images.splice(index, 1)[0];
    this.images.unshift(image);
  }

  async uploadImages(): Promise<{ url: string; caption: string }[]> {
    const uploadedImages: { url: string; caption: string }[] = [];

    for (let i = 0; i < this.images.length; i++) {
      const img = this.images[i];
      if (img.file) {
        this.uploading = true;
        try {
          const result = await this.api.uploadImage(img.file).toPromise();
          uploadedImages.push({
            url: result.url,
            caption: img.caption
          });
        } catch (error) {
          console.error('Upload failed:', error);
          if (img.preview) {
            uploadedImages.push({
              url: img.preview,
              caption: img.caption
            });
          }
        }
        this.uploading = false;
      } else {
        uploadedImages.push({
          url: img.url,
          caption: img.caption
        });
      }
    }

    return uploadedImages;
  }

  private buildPayload(uploadedImages: { url: string; caption: string }[]) {
    const payload: any = {
      name: this.form.name,
      slug: this.form.slug,
      description: this.form.description,
      shortDescription: this.form.shortDescription,
      address: this.form.address,
      provinceId: this.form.provinceId,
      categoryId: this.form.categoryId,
      latitude: this.isBlank(this.form.latitude) ? null : Number(this.form.latitude),
      longitude: this.isBlank(this.form.longitude) ? null : Number(this.form.longitude),
      bestTime: this.form.bestTime,
      estimatedCost: this.form.estimatedCost,
      tips: this.form.tips,
      highlights: this.form.highlights,
      isFeatured: !!this.form.isFeatured,
      isActive: this.form.isActive !== false,
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === '') {
        delete payload[key];
      }
    });

    if (uploadedImages.length > 0) {
      payload.images = uploadedImages;
    }

    return payload;
  }

  async save() {
    if (this.isBlank(this.form.slug)) {
      this.form.slug = this.generateSlug(this.form.name);
    }

    if (!this.validateForm()) {
      this.error = '';
      this.focusFirstInvalidField();
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const uploadedImages = await this.uploadImages();
      const data = this.buildPayload(uploadedImages);

      const action = this.isEdit
        ? this.api.updateDestination(this.form.id, data)
        : this.api.createDestination(data);
      action.subscribe({
        next: () => { this.router.navigate(['/admin/destinations']); },
        error: (err) => { this.error = err.error?.error || 'Lưu thất bại'; this.loading = false; }
      });
    } catch (error) {
      console.error('Save failed:', error);
      this.error = 'Lưu thất bại';
      this.loading = false;
    }
  }
}

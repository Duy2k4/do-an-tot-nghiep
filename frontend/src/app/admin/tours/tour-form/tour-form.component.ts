import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tour-form.component.html'
})
export class TourFormComponent implements OnInit {
  @ViewChild('editorContent') editorContent!: ElementRef;

  isEdit = false;
  form: any = { isFeatured: false, isActive: true };
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

  private stripHtml(value: string): string {
    return String(value || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
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

  validateForm(): boolean {
    this.fieldErrors = {};

    if (this.isBlank(this.form.name)) {
      this.fieldErrors['name'] = 'Vui lòng nhập tên tour';
    } else if (String(this.form.name).trim().length < 2) {
      this.fieldErrors['name'] = 'Tên tour ít nhất 2 ký tự';
    }

    if (!this.isBlank(this.form.slug) && !this.isValidSlug(String(this.form.slug).trim())) {
      this.fieldErrors['slug'] = 'Slug chỉ gồm chữ thường, số và dấu gạch ngang';
    }

    if (this.isBlank(this.form.duration)) {
      this.fieldErrors['duration'] = 'Vui lòng nhập thời gian tour';
    }

    const maxPeople = Number(this.form.maxPeople);
    if (this.form.maxPeople !== undefined && this.form.maxPeople !== null && this.form.maxPeople !== '' && (!Number.isInteger(maxPeople) || maxPeople <= 0)) {
      this.fieldErrors['maxPeople'] = 'Số người tối đa phải là số nguyên lớn hơn 0';
    }

    const price = Number(this.form.price);
    if (this.isBlank(this.form.price)) {
      this.fieldErrors['price'] = 'Vui lòng nhập giá tour';
    } else if (!Number.isFinite(price) || price <= 0) {
      this.fieldErrors['price'] = 'Giá tour phải lớn hơn 0';
    }

    const discountPrice = Number(this.form.discountPrice);
    if (!this.isBlank(this.form.discountPrice) && (!Number.isFinite(discountPrice) || discountPrice < 0)) {
      this.fieldErrors['discountPrice'] = 'Giá giảm không hợp lệ';
    } else if (!this.isBlank(this.form.discountPrice) && Number.isFinite(price) && discountPrice >= price) {
      this.fieldErrors['discountPrice'] = 'Giá giảm phải nhỏ hơn giá gốc';
    }

    if (this.stripHtml(this.form.description).length < 20) {
      this.fieldErrors['description'] = 'Mô tả tour ít nhất 20 ký tự';
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.api.getTour(id).subscribe(d => {
        this.form = { ...d };
        if (d.images && d.images.length > 0) {
          this.images = d.images.map((img: any) => ({
            url: img.url,
            caption: img.caption || '',
          }));
        }
        if (this.editorContent && d.description) {
          this.editorContent.nativeElement.innerHTML = d.description;
        }
      });
    }
  }

  execCmd(command: string) {
    document.execCommand(command, false);
    this.editorContent.nativeElement.focus();
  }

  formatBlock(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    if (value) {
      document.execCommand('formatBlock', false, value);
      select.value = '';
    }
    this.editorContent.nativeElement.focus();
  }

  onContentChange() {
    this.form.description = this.editorContent.nativeElement.innerHTML;
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
    const primaryImageUrl = uploadedImages[0]?.url || this.form.imageUrl;
    const payload: any = {
      name: this.form.name,
      slug: this.form.slug,
      description: this.form.description,
      shortDescription: this.form.shortDescription,
      destinationId: this.form.destinationId,
      duration: this.form.duration,
      maxPeople: Number(this.form.maxPeople),
      price: Number(this.form.price),
      discountPrice: this.isBlank(this.form.discountPrice) ? null : Number(this.form.discountPrice),
      includes: this.form.includes,
      excludes: this.form.excludes,
      imageUrl: primaryImageUrl,
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
    try {
      if (this.editorContent) {
        this.form.description = this.editorContent.nativeElement.innerHTML;
      }

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

      const uploadedImages = await this.uploadImages();
      const tourData = this.buildPayload(uploadedImages);

      const action = this.isEdit
        ? this.api.updateTour(this.form.id, tourData)
        : this.api.createTour(tourData);

      action.subscribe({
        next: () => this.router.navigate(['/admin/tours']),
        error: (err) => {
          this.error = err.error?.error || 'Lưu thất bại';
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Save failed:', error);
      this.error = 'Lưu thất bại';
      this.loading = false;
    }
  }
}

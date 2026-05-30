import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './article-form.component.html'
})
export class ArticleFormComponent implements OnInit {
  @ViewChild('editorContent') editorContent!: ElementRef;
  
  isEdit = false;
  form: any = { isFeatured: false, isPublished: true };
  categories: any[] = [];
  loading = false;
  uploading = false;
  error = '';
  fieldErrors: Record<string, string> = {};
  
  // Quản lý ảnh
  images: { url: string; caption: string; file?: File; preview?: string }[] = [];
  
  constructor(public api: ApiService, private route: ActivatedRoute, private router: Router) {}

  private isBlank(value: unknown): boolean {
    return String(value ?? '').trim().length === 0;
  }

  private stripHtml(value: string): string {
    return String(value || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  validateForm(): boolean {
    this.fieldErrors = {};

    if (this.isBlank(this.form.title)) {
      this.fieldErrors['title'] = 'Vui lòng nhập tiêu đề';
    } else if (String(this.form.title).trim().length < 5) {
      this.fieldErrors['title'] = 'Tiêu đề ít nhất 5 ký tự';
    }

    if (this.isBlank(this.form.categoryId)) {
      this.fieldErrors['categoryId'] = 'Vui lòng chọn danh mục';
    }

    if (!this.isBlank(this.form.excerpt) && String(this.form.excerpt).trim().length < 20) {
      this.fieldErrors['excerpt'] = 'Tóm tắt ít nhất 20 ký tự hoặc để trống';
    }

    if (this.stripHtml(this.form.content).length < 30) {
      this.fieldErrors['content'] = 'Nội dung bài viết ít nhất 30 ký tự';
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
    this.api.getArticleCategories().subscribe(d => { this.categories = d; });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.api.getArticle(id).subscribe(d => {
        this.form = { ...d };
        // Tải ảnh hiện có
        if (d.images && d.images.length > 0) {
          this.images = d.images.map((img: any) => ({
            url: img.url,
            caption: img.caption || '',
            isPrimary: img.isPrimary
          }));
        }
        // Gán nội dung trình soạn thảo sau khi giao diện tải xong
        setTimeout(() => {
          if (this.editorContent && d.content) {
            this.editorContent.nativeElement.innerHTML = d.content;
          }
        }, 100);
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
      select.value = ''; // Reset select
    }
    this.editorContent.nativeElement.focus();
  }
  
  insertLink() {
    const url = prompt('Nhập URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
    this.editorContent.nativeElement.focus();
  }
  
  insertImage() {
    const url = prompt('Nhập URL hình ảnh:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
    this.editorContent.nativeElement.focus();
  }
  
  onContentChange() {
    this.form.content = this.editorContent.nativeElement.innerHTML;
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
      title: this.form.title,
      slug: this.form.slug,
      content: this.form.content,
      excerpt: this.form.excerpt,
      imageUrl: this.form.imageUrl,
      categoryId: this.form.categoryId,
      tags: this.form.tags,
      isFeatured: !!this.form.isFeatured,
      isPublished: this.form.isPublished !== false,
      images: uploadedImages,
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === '') {
        delete payload[key];
      }
    });

    return payload;
  }
  
  async save() {
    try {
      // Lấy nội dung từ trình soạn thảo
      this.form.content = this.editorContent.nativeElement.innerHTML;

      if (!this.validateForm()) {
        this.error = '';
        this.focusFirstInvalidField();
        return;
      }

      this.loading = true;
      this.error = '';
      
      // Tải lên new images and prepare data
      const uploadedImages = await this.uploadImages();
      const articleData = this.buildPayload(uploadedImages);
      
      const action = this.isEdit 
        ? this.api.updateArticle(this.form.id, articleData)
        : this.api.createArticle(articleData);
      
      action.subscribe({
        next: () => this.router.navigate(['/admin/articles']),
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

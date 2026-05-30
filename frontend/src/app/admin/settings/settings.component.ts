import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface Setting {
  key: string;
  value: string;
  group: string;
  label: string;
  type: string;
  isPublic: boolean;
}

interface SettingGroup {
  name: string;
  icon: string;
  label: string;
  settings?: Setting[];
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  loading = true;
  saving = false;
  activeGroup = 'general';
  
  settingsList: Setting[] = [];
  editValues: { [key: string]: string } = {};
  originalValues: { [key: string]: string } = {};
  
  hasChanges = false;
  successMessage = '';
  errorMessage = '';
  fieldErrors: { [key: string]: string } = {};

  groups: SettingGroup[] = [
    { name: 'general', icon: 'settings', label: 'Chung' },
    { name: 'contact', icon: 'contact_phone', label: 'Liên hệ' },
    { name: 'social', icon: 'share', label: 'Mạng xã hội' },
    { name: 'seo', icon: 'public', label: 'SEO' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading = true;
    this.api.getSettings().subscribe({
      next: (res: any) => {
        this.settingsList = res.settingsList || [];
        this.settingsList.forEach(s => {
          this.editValues[s.key] = s.value;
          this.originalValues[s.key] = s.value;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading settings:', err);
        this.loading = false;
        this.errorMessage = 'Không thể tải cài đặt';
      }
    });
  }

  get currentGroupSettings(): Setting[] {
    return this.settingsList.filter(s => s.group === this.activeGroup);
  }

  setActiveGroup(group: string) {
    this.activeGroup = group;
    this.checkChanges();
  }

  checkChanges() {
    this.hasChanges = Object.keys(this.editValues).some(key => 
      this.editValues[key] !== this.originalValues[key]
    );
  }

  updateValue(key: string, value: string) {
    this.editValues[key] = value;
    this.validateField(key);
    this.checkChanges();
  }

  validateField(key: string): boolean {
    const setting = this.settingsList.find(s => s.key === key);
    if (!setting) return true;

    const value = String(this.editValues[key] ?? '').trim();
    delete this.fieldErrors[key];

    if (setting.type === 'number' && value && !Number.isFinite(Number(value))) {
      this.fieldErrors[key] = 'Giá trị phải là số';
    }

    if (key.toLowerCase().includes('email') && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.fieldErrors[key] = 'Email không đúng định dạng';
    }

    if ((key.toLowerCase().includes('url') || key.toLowerCase().includes('facebook') || key.toLowerCase().includes('youtube')) && value) {
      try {
        new URL(value);
      } catch {
        this.fieldErrors[key] = 'URL không hợp lệ';
      }
    }

    return !this.fieldErrors[key];
  }

  validateAll(): boolean {
    this.fieldErrors = {};
    this.settingsList.forEach(setting => this.validateField(setting.key));
    return Object.keys(this.fieldErrors).length === 0;
  }

  private focusFirstInvalidField() {
    setTimeout(() => {
      const firstInvalid = document.querySelector<HTMLElement>('.is-invalid');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid?.focus?.();
    });
  }

  saveAll() {
    if (!this.validateAll()) {
      this.errorMessage = '';
      this.focusFirstInvalidField();
      return;
    }

    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const settingsToUpdate: { [key: string]: string } = {};
    Object.keys(this.editValues).forEach(key => {
      if (this.editValues[key] !== this.originalValues[key]) {
        settingsToUpdate[key] = this.editValues[key];
      }
    });

    if (Object.keys(settingsToUpdate).length === 0) {
      this.saving = false;
      return;
    }

    this.api.updateSettingsBulk(settingsToUpdate).subscribe({
      next: () => {
        // Cập nhật giá trị ban đầu
        Object.keys(settingsToUpdate).forEach(key => {
          this.originalValues[key] = settingsToUpdate[key];
        });
        this.checkChanges();
        this.saving = false;
        this.successMessage = 'Lưu thành công!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error saving settings:', err);
        this.saving = false;
        this.errorMessage = 'Lưu thất bại. Vui lòng thử lại.';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  resetChanges() {
    Object.keys(this.editValues).forEach(key => {
      this.editValues[key] = this.originalValues[key];
    });
    this.checkChanges();
  }

  getFieldType(type: string): string {
    return type === 'textarea' ? 'textarea' : 'text';
  }

  isTextarea(type: string): boolean {
    return type === 'textarea';
  }

  get currentGroupLabel(): string {
    const group = this.groups.find(g => g.name === this.activeGroup);
    return group?.label || '';
  }
}

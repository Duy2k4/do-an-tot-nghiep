import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
  timestamp?: Date;
  isTemplate?: boolean;
  cards?: any[];
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.css']
})
export class ChatbotWidgetComponent {
  isOpen = false;
  messages: ChatMessage[] = [];
  inputMessage = '';
  loading = false;
  sessionId = '';
  showTyping = false;

  readonly quickActions = [
    { label: 'Địa điểm biển', icon: 'beach_access', query: 'Gợi ý địa điểm du lịch biển đẹp' },
    { label: 'Tour gia đình', icon: 'family_restroom', query: 'Gợi ý tour cho gia đình' },
    { label: 'Chi phí du lịch', icon: 'payments', query: 'Chi phí du lịch Việt Nam' },
    { label: 'Địa điểm lãng mạn', icon: 'favorite', query: 'Địa điểm lãng mạn cho cặp đôi' },
  ];

  constructor(private api: ApiService, public auth: AuthService) {}

  toggleWindow() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.inputMessage.trim() || this.loading) return;
    this.sendToApi(this.inputMessage.trim());
    this.inputMessage = '';
  }

  sendQuickMessage(message: string) {
    if (this.loading) return;
    this.sendToApi(message);
  }

  private sendToApi(message: string) {
    this.messages.push({
      role: 'user',
      message: message,
      timestamp: new Date()
    });
    this.loading = true;
    this.showTyping = true;
    this.scrollToBottom();

    this.api.sendMessage({ message, sessionId: this.sessionId }).subscribe({
      next: (res: any) => {
        this.showTyping = false;
        this.messages.push({
          role: 'assistant',
          message: res.reply,
          timestamp: new Date(),
          isTemplate: res.source === 'template',
          cards: res.cards || []
        });
        this.sessionId = res.sessionId || this.sessionId;
        this.loading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.showTyping = false;
        this.messages.push({
          role: 'assistant',
          message: 'Xin lỗi, tôi đang gặp sự cố kết nối. Bạn vui lòng thử lại nhé!',
          timestamp: new Date(),
          isTemplate: true
        });
        this.loading = false;
        this.scrollToBottom();
      }
    });
  }

  formatTime(date: Date | undefined): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatMessage(text: string): string {
    if (!text) return '';
    let formatted = text
      // Thoát ký tự HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // In đậm văn bản **text**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Xuống dòng
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    return formatted;
  }

  trackByFn(index: number, msg: ChatMessage): number {
    return index;
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = document.querySelector('.chatbot-messages');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}

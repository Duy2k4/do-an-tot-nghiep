import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css']
})
export class TourDetailComponent implements OnInit {
  tour: any = null;
  constructor(public api: ApiService, private route: ActivatedRoute) {}
  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug') || this.route.snapshot.paramMap.get('id') || '';
    this.api.getTour(slug).subscribe(data => { this.tour = data; });
  }
  getIncludes(): string[] { try { return JSON.parse(this.tour?.includes || '[]'); } catch { return []; } }
}

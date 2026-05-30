import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  loading = true;
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getFavorites().subscribe(data => { this.favorites = data; this.loading = false; }, () => { this.loading = false; }); }
}

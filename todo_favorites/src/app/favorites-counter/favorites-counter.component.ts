import { Component, inject } from '@angular/core';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-favorites-counter',
  standalone: true,
  templateUrl: './favorites-counter.component.html',
  styleUrls: ['./favorites-counter.component.css']
})
export class FavoritesCounterComponent {
  readonly favorites = inject(FavoritesService);
}

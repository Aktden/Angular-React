import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly favoriteIds = signal<Set<number>>(new Set<number>());

  toggle(id: number): void {
    this.favoriteIds.update((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(id)) {
        nextIds.delete(id);
      } else {
        nextIds.add(id);
      }

      return nextIds;
    });
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds().has(id);
  }

  getCount(): number {
    return this.favoriteIds().size;
  }

  remove(id: number): void {
    this.favoriteIds.update((currentIds) => {
      if (!currentIds.has(id)) {
        return currentIds;
      }

      const nextIds = new Set(currentIds);
      nextIds.delete(id);
      return nextIds;
    });
  }
}

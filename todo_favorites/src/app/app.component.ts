import { Component } from '@angular/core';
import { FavoritesCounterComponent } from './favorites-counter/favorites-counter.component';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FavoritesCounterComponent, TodoListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../services/favorites.service';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  private readonly todoService = inject(TodoService);
  readonly favorites = inject(FavoritesService);
  readonly todos = this.todoService.todos;

  newTodoTitle = '';

  addTodo(): void {
    const title = this.newTodoTitle.trim();

    if (!title) {
      return;
    }

    this.todoService.add(title);
    this.newTodoTitle = '';
  }

  toggleCompleted(id: number): void {
    this.todoService.toggleCompleted(id);
  }

  deleteTodo(id: number): void {
    this.todoService.remove(id);
    this.favorites.remove(id);
  }

  taskWord(count: number): string {
    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'задач';
    }

    if (lastDigit === 1) {
      return 'задача';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'задачи';
    }

    return 'задач';
  }
}

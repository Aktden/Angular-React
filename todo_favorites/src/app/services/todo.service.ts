import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly todosState = signal<Todo[]>([
    { id: 1, title: 'Разобраться с Angular-сервисами', completed: true },
    { id: 2, title: 'Добавить систему избранного', completed: false },
    { id: 3, title: 'Проверить реактивное обновление счётчика', completed: false }
  ]);

  readonly todos = this.todosState.asReadonly();
  private nextId = 4;

  add(title: string): void {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    const newTodo: Todo = {
      id: this.nextId,
      title: normalizedTitle,
      completed: false
    };

    this.nextId += 1;
    this.todosState.update((todos) => [...todos, newTodo]);
  }

  remove(id: number): void {
    this.todosState.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  toggleCompleted(id: number): void {
    this.todosState.update((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
}

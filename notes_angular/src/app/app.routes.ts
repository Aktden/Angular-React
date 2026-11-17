import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotesListComponent } from './notes-list/notes-list.component';
import { NoteFormComponent } from './note-form/note-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Главная' },
  { path: 'notes', component: NotesListComponent, title: 'Заметки' },
  { path: 'create', component: NoteFormComponent, title: 'Создать заметку' },
  { path: '**', redirectTo: '' }
];

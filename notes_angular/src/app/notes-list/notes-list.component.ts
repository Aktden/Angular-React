import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Note, NoteService } from '../note.service';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css'
})
export class NotesListComponent implements OnInit {
  private readonly noteService = inject(NoteService);

  notes: Note[] = [];
  isLoading = true;
  errorMessage = '';
  deletingId: number | null = null;

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Не удалось загрузить заметки. Проверьте, запущен ли сервер json-server.';
        this.isLoading = false;
      }
    });
  }

  remove(id: number): void {
    this.deletingId = id;
    this.errorMessage = '';

    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.notes = this.notes.filter((note) => note.id !== id);
        this.deletingId = null;
      },
      error: () => {
        this.errorMessage = 'Не удалось удалить заметку. Попробуйте ещё раз.';
        this.deletingId = null;
      }
    });
  }
}

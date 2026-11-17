import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.css'
})
export class NoteFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly noteService = inject(NoteService);

  readonly noteForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    text: ['', [Validators.required, Validators.minLength(5)]]
  });

  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  get title() {
    return this.noteForm.get('title');
  }

  get text() {
    return this.noteForm.get('text');
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.noteForm.invalid) {
      this.noteForm.markAllAsTouched();
      return;
    }

    const formValue = this.noteForm.getRawValue();
    this.isSubmitting = true;

    this.noteService.addNote({
      title: formValue.title ?? '',
      text: formValue.text ?? ''
    }).subscribe({
      next: () => {
        this.noteForm.reset();
        this.successMessage = 'Заметка создана';
        this.isSubmitting = false;
      },
      error: () => {
        this.errorMessage = 'Не удалось создать заметку';
        this.isSubmitting = false;
      }
    });
  }
}

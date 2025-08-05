import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  standalone:false,
  styleUrls: ['./edit-student.component.scss'],
})
export class EditStudentComponent implements OnInit {
  editForm!: FormGroup;
  allStudents: any[] = [];
  isStudentSelected = false;
  studentId: number | null = null;
  isLoading = true;
  isSubmitting = false;
  apiError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      course: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.loadAllStudents();
  }

  loadAllStudents(): void {
    this.isLoading = true;
    this.apiError = null;

    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.allStudents = Array.isArray(students) ? students : [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load students:', err);
        this.apiError = 'Unable to fetch student list. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  onStudentSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.apiError = null;

    if (!value) {
      this.resetForm();
      return;
    }

    const id = +value;
    if (isNaN(id)) return;

    this.studentId = id;
    this.isStudentSelected = true;
    this.loadStudentData(id);
  }

  loadStudentData(id: number): void {
    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.editForm.patchValue({
          name: student.name,
          course: student.course,
          email: student.email,
        });
      },
      error: (err) => {
        console.error('Failed to load student:', err);
        this.apiError = `Could not load data for student ID ${id}.`;
        this.resetForm();
      },
    });
  }

  // Getters for template
  get name() { return this.editForm.get('name'); }
  get course() { return this.editForm.get('course'); }
  get email() { return this.editForm.get('email'); }

  onSubmit(): void {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid || !this.studentId) {
      return;
    }

    this.isSubmitting = true;
    this.apiError = null;

    const payload = this.editForm.value;

    this.studentService.updateStudent(this.studentId, payload).subscribe({
      next: () => {
        alert('✅ Student updated successfully!');
        this.router.navigate(['/students/list']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.apiError =
          err?.error?.message ||
          err?.status === 404
            ? 'Student not found.'
            : 'Failed to update. Please try again.';
        console.error('Update error:', err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/students/list']);
  }

  private resetForm(): void {
    this.isStudentSelected = false;
    this.studentId = null;
    this.editForm.reset();
  }
}
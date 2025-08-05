import { Component, OnInit, OnDestroy, TrackByFunction } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { StudentService, PagedResponse, StudentFilters } from '../../services/student.service';
import { AuthService, User } from '../../services/auth-service';

export interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
}

@Component({
  selector: 'app-dashboard',
  standalone:false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  trackByStudentId: TrackByFunction<Student> = (index, item) => item.id;
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  isLoading = true;
  students: Student[] = [];
  uniqueCourses: string[] = [];
  
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sortField = 'name';
  sortDirection = 'asc';
  
  globalSearchControl = new FormControl('');
  courseFilterControl = new FormControl('');
  sortFieldControl = new FormControl('name');
  sortDirectionControl = new FormControl('asc');
  pageSizeControl = new FormControl(10);
  
  // ✅ REMOVED: Modal properties are no longer needed
  // showDeleteModal: boolean = false;
  // studentToDelete: Student | null = null;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/students/login']);
      return;
    }
    
    this.setupFormControls();
    this.loadStudentsData();
    this.loadUniqueCourses();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private setupFormControls(): void {
    this.globalSearchControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.resetPageAndLoadData());
      
    this.courseFilterControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.resetPageAndLoadData());

    this.sortFieldControl.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => { if (value !== null) { this.sortField = value; this.loadStudentsData(); } });

    this.sortDirectionControl.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => { if (value !== null) { this.sortDirection = value; this.loadStudentsData(); } });

    this.pageSizeControl.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => { if (value !== null) { this.pageSize = value; this.resetPageAndLoadData(); } });
  }
  
  private loadStudentsData(): void {
    this.isLoading = true;
    const filters: StudentFilters = {
      search: this.globalSearchControl.value?.trim() || undefined,
      course: this.courseFilterControl.value || undefined
    };
    
    this.studentService.getStudentsPaginated(this.currentPage, this.pageSize, this.sortField, this.sortDirection, filters)
      .subscribe({
        next: (response: PagedResponse<Student>) => {
          this.students = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.isLoading = false;
        }
      });
  }
  
  private loadUniqueCourses(): void {
    this.studentService.getAllStudents().subscribe({
      next: (students: any) => {
        const coursesSet = new Set((students as Student[]).map(s => s.course));
        this.uniqueCourses = Array.from(coursesSet).sort();
      },
      error: (error) => console.error('Error loading courses:', error)
    });
  }
  
  private resetPageAndLoadData(): void {
    this.currentPage = 0;
    this.loadStudentsData();
  }
  
  sort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortFieldControl.setValue(this.sortField, { emitEvent: false });
    this.sortDirectionControl.setValue(this.sortDirection, { emitEvent: false });
    this.loadStudentsData();
  }
  
  getSortIcon(field: string): string {
    if (this.sortField !== field) return 'ph-dots-three';
    return this.sortDirection === 'asc' ? 'ph-caret-up' : 'ph-caret-down';
  }
  
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadStudentsData();
    }
  }

  onPageChange(page: number): void {
    this.goToPage(page);
  }

  getStartIndex(): number { return this.currentPage * this.pageSize; }
  getEndIndex(): number { return Math.min(this.getStartIndex() + this.pageSize, this.totalElements); }
  
  // ✅ REMOVED: All action methods (viewStudent, editStudent, deleteStudent, etc.)
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/students/login']);
  }
  
  hasActiveFilters(): boolean {
    return !!(this.globalSearchControl.value?.trim() || this.courseFilterControl.value);
  }
  
  clearFilters(): void {
    this.globalSearchControl.setValue('');
    this.courseFilterControl.setValue('');
  }
}
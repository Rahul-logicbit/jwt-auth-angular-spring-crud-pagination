// services/student.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { URLService } from './url-service'; 
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface StudentFilters {
  name?: string;
  email?: string;
  course?: string;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(
    private http: HttpClient,
    private urlService: URLService
  ) {
    console.log("StudentService: object is created");
  }

  // Error handler
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  /**
   * Get students with pagination, sorting, and filtering
   */
  public getStudentsPaginated(
    page: number = 0, 
    size: number = 10, 
    sortBy: string = 'id', 
    sortDir: string = 'asc',
    filters?: StudentFilters
  ): Observable<PagedResponse<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    
    // Add filters if provided
    if (filters) {
      if (filters.name) params = params.set('name', filters.name);
      if (filters.email) params = params.set('email', filters.email);
      if (filters.course) params = params.set('course', filters.course);
      if (filters.search) params = params.set('search', filters.search);
    }
    
    return this.http.get<PagedResponse<any>>(this.urlService.getStudentsPaginatedAPI, { params })
      .pipe(catchError(this.handleError));
  }

  // Get all students
  public getAllStudents(): Observable<any> {
    return this.http.get(this.urlService.getAllStudentsAPI)
      .pipe(catchError(this.handleError));
  }

  // Get student by ID
  public getStudentById(id: number): Observable<any> {
    const url = `${this.urlService.getStudentByIdAPI}?id=${id}`;
    return this.http.get(url)
      .pipe(catchError(this.handleError));
  }

  // Update student
  public updateStudent(id: number, student: any): Observable<any> {
    const url = `${this.urlService.updateStudentAPI}?id=${id}`;
    return this.http.put(url, student)
      .pipe(catchError(this.handleError));
  }

  // Delete student
  public deleteStudent(id: number): Observable<any> {
    const url = `${this.urlService.deleteStudentAPI}?id=${id}`;
    return this.http.delete(url, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }
}



import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student.service'; // Adjust path as needed

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  standalone:false,
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {

  public student: any | null = null;
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute, // Injects the ActivatedRoute to get route parameters
    private router: Router,       // Injects the Router for navigation
    private studentService: StudentService
  ) {
    console.log("student-detail component object created");
  }

  ngOnInit(): void {
    // Get the 'id' from the URL, e.g., '/students/detail/1'
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const studentId = +idParam; // The '+' converts the string 'id' to a number
      this.loadStudentDetails(studentId);
    } else {
      this.errorMessage = "Student ID not found in URL.";
      this.isLoading = false;
    }
  }

  /**
   * Fetches the details for a single student.
   * @param id The numeric ID of the student.
   */
  loadStudentDetails(id: number): void {
    this.isLoading = true;
    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.student = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "Could not find student details. Please check the ID and try again.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  /**
   * Navigates back to the main student list.
   */
  goBack(): void {
    this.router.navigate(['/students']); // Assuming your list route is '/students'
  }

  /**
   * Navigates to the edit page for the current student.
   */
  editStudent(): void {
    if (this.student) {
      this.router.navigate(['/students/edit', this.student.id]);
    }
  }
}
//package in.mp.controller;
//
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import in.mp.entity.Student;
//import in.mp.service.StudentService;
//import jakarta.validation.Valid; // 1. Add this import
//
//@RestController
//@RequestMapping("/api/students")
//@CrossOrigin(origins = "http://localhost:4200")
//public class StudentController {
//
//    private final StudentService studentService;
//
//    @Autowired
//    public StudentController(StudentService studentService) {
//        this.studentService = studentService;
//    }
//
//    // Create a new student
//    @PostMapping("/signup")
//    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) { // 2. Add @Valid here
//        Student createdStudent = studentService.saveStudent(student);
//        return ResponseEntity.ok(createdStudent);
//    }
//
//    // Get all students
//    @GetMapping("/studentlist")
//    public ResponseEntity<List<Student>> getAllStudents() {
//        List<Student> students = studentService.getAllStudents();
//        return ResponseEntity.ok(students);
//    }
//
//    // Get student by ID using request parameter
//    @GetMapping("/by-id")
//    public ResponseEntity<Student> getStudentById(@RequestParam Long id) {
//        Student student = studentService.getStudentById(id);
//        return ResponseEntity.ok(student);
//    }
//
//    // Update student using request parameter
//    @PutMapping("/updatestudent")
//    public ResponseEntity<Student> updateStudent(
//            @RequestParam Long id,
//            @Valid @RequestBody Student student) { // 3. And add @Valid here
//    	
//        Student updatedStudent = studentService.updateStudent(id, student);
//        return ResponseEntity.ok(updatedStudent);
//    }
//
//    // Delete student using request parameter
//    @DeleteMapping("/deletestudent")
//    public ResponseEntity<String> deleteStudent(@RequestParam Long id) {
//        studentService.deleteStudent(id);
//        return ResponseEntity.ok("Student with ID " + id + " deleted successfully.");
//    }
//}
//
//
//
//package in.mp.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import in.mp.entity.Student;
//import in.mp.service.StudentService;
//import jakarta.validation.Valid;
//
//@RestController
//@RequestMapping("/api/students")
//@CrossOrigin(origins = "http://localhost:4200")
//public class StudentController {
//
//    private final StudentService studentService;
//
//    @Autowired
//    public StudentController(StudentService studentService) {
//        this.studentService = studentService;
//    }
//
//    // Student login
//    @PostMapping("/login")
//    public ResponseEntity<?> loginStudent(@RequestBody LoginRequest loginRequest) {
//        try {
//            Student student = studentService.authenticateStudent(loginRequest.getEmail(), loginRequest.getPassword());
//            
//            // Create response without password for security
//            LoginResponse response = new LoginResponse();
//            response.setId(student.getId());
//            response.setName(student.getName());
//            response.setEmail(student.getEmail());
//            response.setCourse(student.getCourse());
//            response.setMessage("Login successful");
//            
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            return ResponseEntity.status(401).body(new ErrorResponse("Invalid email or password"));
//        }
//    }
//
//    // Create a new student
//    @PostMapping("/signup")
//    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
//        Student createdStudent = studentService.saveStudent(student);
//        return ResponseEntity.ok(createdStudent);
//    }
//
//    // Get all students
//    @GetMapping("/studentlist")
//    public ResponseEntity<List<Student>> getAllStudents() {
//        List<Student> students = studentService.getAllStudents();
//        return ResponseEntity.ok(students);
//    }
//
//    // Get student by ID using request parameter
//    @GetMapping("/by-id")
//    public ResponseEntity<Student> getStudentById(@RequestParam Long id) {
//        Student student = studentService.getStudentById(id);
//        return ResponseEntity.ok(student);
//    }
//
//    // Update student using request parameter
//    @PutMapping("/updatestudent")
//    public ResponseEntity<Student> updateStudent(
//            @RequestParam Long id,
//            @Valid @RequestBody Student student) {
//    
//        Student updatedStudent = studentService.updateStudent(id, student);
//        return ResponseEntity.ok(updatedStudent);
//    }
//
//    // Delete student using request parameter
//    @DeleteMapping("/deletestudent")
//    public ResponseEntity<String> deleteStudent(@RequestParam Long id) {
//        studentService.deleteStudent(id);
//        return ResponseEntity.ok("Student with ID " + id + " deleted successfully.");
//    }
//
//    // Inner classes for request/response
//    public static class LoginRequest {
//        private String email;
//        private String password;
//
//        // Getters and setters
//        public String getEmail() { return email; }
//        public void setEmail(String email) { this.email = email; }
//        public String getPassword() { return password; }
//        public void setPassword(String password) { this.password = password; }
//    }
//
//    public static class LoginResponse {
//        private Long id;
//        private String name;
//        private String email;
//        private String course;
//        private String message;
//
//        // Getters and setters
//        public Long getId() { return id; }
//        public void setId(Long id) { this.id = id; }
//        public String getName() { return name; }
//        public void setName(String name) { this.name = name; }
//        public String getEmail() { return email; }
//        public void setEmail(String email) { this.email = email; }
//        public String getCourse() { return course; }
//        public void setCourse(String course) { this.course = course; }
//        public String getMessage() { return message; }
//        public void setMessage(String message) { this.message = message; }
//    }
//
//    public static class ErrorResponse {
//        private String error;
//
//        public ErrorResponse(String error) { this.error = error; }
//        public String getError() { return error; }
//        public void setError(String error) { this.error = error; }
//    }
//}
//



package in.mp.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import in.mp.entity.Student;
import in.mp.service.StudentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Enhanced endpoint with pagination, sorting, and filtering
    @GetMapping("/paginated")
    public ResponseEntity<PagedResponse<Student>> getStudentsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String course,
            @RequestParam(required = false) String search
    ) {
        // Create sort object
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
            
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Student> studentPage;
        
        // Determine which search to perform
        if (search != null && !search.trim().isEmpty()) {
            // Global search
            studentPage = studentService.globalSearchStudents(search, pageable);
        } else if (name != null || email != null || course != null) {
            // Filtered search
            studentPage = studentService.searchStudents(name, email, course, pageable);
        } else {
            // Regular pagination
            studentPage = studentService.getAllStudentsPaginated(pageable);
        }
        
        PagedResponse<Student> response = new PagedResponse<>();
        response.setContent(studentPage.getContent());
        response.setPage(studentPage.getNumber());
        response.setSize(studentPage.getSize());
        response.setTotalElements(studentPage.getTotalElements());
        response.setTotalPages(studentPage.getTotalPages());
        response.setFirst(studentPage.isFirst());
        response.setLast(studentPage.isLast());
        
        return ResponseEntity.ok(response);
    }

    // Keep all existing endpoints unchanged
//    @PostMapping("/login")
//    public ResponseEntity<?> loginStudent(@RequestBody LoginRequest loginRequest) {
//        try {
//            Student student = studentService.authenticateStudent(loginRequest.getEmail(), loginRequest.getPassword());
//            
//            LoginResponse response = new LoginResponse();
//            response.setId(student.getId());
//            response.setName(student.getName());
//            response.setEmail(student.getEmail());
//            response.setCourse(student.getCourse());
//            response.setMessage("Login successful");
//            
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            return ResponseEntity.status(401).body(new ErrorResponse("Invalid email or password"));
//        }
//    }

//    @PostMapping("/signup")
//    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
//        Student createdStudent = studentService.saveStudent(student);
//        return ResponseEntity.ok(createdStudent);
//    }

    @GetMapping("/studentlist")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/by-id")
    public ResponseEntity<Student> getStudentById(@RequestParam Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @PutMapping("/updatestudent")
    public ResponseEntity<Student> updateStudent(
            @RequestParam Long id,
            @Valid @RequestBody Student student) {
    
        Student updatedStudent = studentService.updateStudent(id, student);
        return ResponseEntity.ok(updatedStudent);
    }

    @DeleteMapping("/deletestudent")
    public ResponseEntity<String> deleteStudent(@RequestParam Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok("Student with ID " + id + " deleted successfully.");
    }

    // Response DTOs
    public static class PagedResponse<T> {
        private List<T> content;
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private boolean first;
        private boolean last;

        // Getters and setters
        public List<T> getContent() { return content; }
        public void setContent(List<T> content) { this.content = content; }
        public int getPage() { return page; }
        public void setPage(int page) { this.page = page; }
        public int getSize() { return size; }
        public void setSize(int size) { this.size = size; }
        public long getTotalElements() { return totalElements; }
        public void setTotalElements(long totalElements) { this.totalElements = totalElements; }
        public int getTotalPages() { return totalPages; }
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
        public boolean isFirst() { return first; }
        public void setFirst(boolean first) { this.first = first; }
        public boolean isLast() { return last; }
        public void setLast(boolean last) { this.last = last; }
    }

    public static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    
    public static class LoginResponse {
        private Long id;
        private String name;
        private String email;
        private String course;
        private String message;
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCourse() { return course; }
        public void setCourse(String course) { this.course = course; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ErrorResponse {
        private String error;
        public ErrorResponse(String error) { this.error = error; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}


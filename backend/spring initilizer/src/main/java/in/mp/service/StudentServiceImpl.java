package in.mp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import in.mp.entity.Student;
import in.mp.exception.ResourceNotFoundException;
import in.mp.repository.StudentRepository;

@Service
public class StudentServiceImpl implements StudentService {
    
    @Autowired
    private StudentRepository studentRepo;

    @Override
    public Page<Student> getAllStudentsPaginated(Pageable pageable) {
        return studentRepo.findAll(pageable);
    }
    
    @Override
    public Page<Student> searchStudents(String name, String email, String course, Pageable pageable) {
        return studentRepo.findStudentsWithFilters(name, email, course, pageable);
    }
    
    @Override
    public Page<Student> globalSearchStudents(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return studentRepo.findAll(pageable);
        }
        return studentRepo.findByGlobalSearch(search.trim(), pageable);
    }

    // Keep all existing methods unchanged
    @Override
    public Student authenticateStudent(String email, String password) {
        Student student = studentRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
        
        if (!student.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        
        return student;
    }

    @Override
    public Student saveStudent(Student student) {
        return studentRepo.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }
    
    @Override
    public Student getStudentById(Long id) {
        return studentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
    }

    @Override
    public Student updateStudent(Long id, Student studentDetails) {
        Student existingStudent = studentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        existingStudent.setName(studentDetails.getName());
        existingStudent.setCourse(studentDetails.getCourse());
        existingStudent.setEmail(studentDetails.getEmail());

        if (studentDetails.getPassword() != null && !studentDetails.getPassword().isEmpty()) {
            existingStudent.setPassword(studentDetails.getPassword());
        }

        return studentRepo.save(existingStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepo.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with ID: " + id);
        }
        studentRepo.deleteById(id);
    }
}

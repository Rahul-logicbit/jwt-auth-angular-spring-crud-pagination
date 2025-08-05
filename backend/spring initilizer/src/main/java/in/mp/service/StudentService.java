package in.mp.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import in.mp.entity.Student;

public interface StudentService {
    Student saveStudent(Student student);
    List<Student> getAllStudents();
    Page<Student> getAllStudentsPaginated(Pageable pageable);
    Page<Student> searchStudents(String name, String email, String course, Pageable pageable);
    Page<Student> globalSearchStudents(String search, Pageable pageable);
    Student getStudentById(Long id);
    Student updateStudent(Long id, Student studentDetails);
    void deleteStudent(Long id);
    Student authenticateStudent(String email, String password);
}

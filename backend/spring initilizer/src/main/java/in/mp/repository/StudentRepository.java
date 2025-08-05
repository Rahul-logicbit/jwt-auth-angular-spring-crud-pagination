 package in.mp.repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import in.mp.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmail(String email);
    
    // Enhanced search with pagination and sorting
    @Query("SELECT s FROM Student s WHERE " +
           "(:name IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:email IS NULL OR LOWER(s.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(:course IS NULL OR LOWER(s.course) LIKE LOWER(CONCAT('%', :course, '%')))")
    Page<Student> findStudentsWithFilters(
        @Param("name") String name,
        @Param("email") String email, 
        @Param("course") String course,
        Pageable pageable
    );
    
    // Global search across all fields
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.course) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Student> findByGlobalSearch(@Param("search") String search, Pageable pageable);
}

package in.mp.service;

import in.mp.dto.AuthRequest;
import in.mp.dto.AuthResponse;
import in.mp.entity.Student;
import in.mp.repository.StudentRepository;
import in.mp.security.JwtTokenProvider;
import in.mp.service.MyUserDetailsService.StudentPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private MyUserDetailsService userDetailsService;

    /**
     * Register a new student
     */
    public AuthResponse registerStudent(AuthRequest signUpRequest) {
        // Check if user already exists
        if (studentRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new student
        Student student = new Student();
        student.setEmail(signUpRequest.getEmail());
        student.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        
        // Set name and course if provided
        if (signUpRequest.getName() != null) {
            student.setName(signUpRequest.getName());
        }
        if (signUpRequest.getCourse() != null) {
            student.setCourse(signUpRequest.getCourse());
        }

        // Save student
        Student savedStudent = studentRepository.save(student);

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedStudent.getEmail());
        String jwt = jwtTokenProvider.generateToken(userDetails);

        // Return response
        return new AuthResponse(
                jwt,
                savedStudent.getId(),
                savedStudent.getEmail(),
                savedStudent.getName(),
                savedStudent.getCourse()
        );
    }

    /**
     * Authenticate existing student
     */
    public AuthResponse authenticateStudent(AuthRequest loginRequest) {
        try {
            // Authenticate user credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Get user details from authentication
            StudentPrincipal studentPrincipal = (StudentPrincipal) authentication.getPrincipal();
            Student student = studentPrincipal.getStudent();

            // Generate JWT token
            String jwt = jwtTokenProvider.generateToken(studentPrincipal);

            // Return response
            return new AuthResponse(
                    jwt,
                    student.getId(),
                    student.getEmail(),
                    student.getName(),
                    student.getCourse()
            );

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Incorrect email or password");
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    /**
     * Get student by email
     */
    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    /**
     * Check if student exists by email
     */
    public boolean existsByEmail(String email) {
        return studentRepository.findByEmail(email).isPresent();
    }
}

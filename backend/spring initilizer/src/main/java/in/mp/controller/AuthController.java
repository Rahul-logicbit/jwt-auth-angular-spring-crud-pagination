package in.mp.controller;

import in.mp.dto.AuthRequest;
import in.mp.dto.AuthResponse;
import in.mp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signupStudent(@Valid @RequestBody AuthRequest signUpRequest) {
        try {
            AuthResponse authResponse = authService.registerStudent(signUpRequest);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(@Valid @RequestBody AuthRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.authenticateStudent(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body("Error: " + e.getMessage());
        }
    }
}

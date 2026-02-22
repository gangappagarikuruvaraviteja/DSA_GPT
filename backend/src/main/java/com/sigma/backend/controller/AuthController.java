package com.sigma.backend.controller;

import com.sigma.backend.dto.AuthRequest;
import com.sigma.backend.dto.AuthResponse;
import com.sigma.backend.model.User;
import com.sigma.backend.repository.UserRepository;
import com.sigma.backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // =========================
    // SIGN UP
    // =========================
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Email and password are required");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("User already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Signup successful");
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        return userRepository.findByEmail(request.getEmail())
                .map(user -> {

                    if (!passwordEncoder.matches(
                            request.getPassword(),
                            user.getPassword()
                    )) {
                        return ResponseEntity
                                .status(401)
                                .body("Invalid email or password");
                    }

                    String token = jwtUtil.generateToken(user.getEmail());
                    return ResponseEntity.ok(new AuthResponse(token));

                })
                .orElseGet(() ->
                        ResponseEntity
                                .status(401)
                                .body("Invalid email or password")
                );
    }
}

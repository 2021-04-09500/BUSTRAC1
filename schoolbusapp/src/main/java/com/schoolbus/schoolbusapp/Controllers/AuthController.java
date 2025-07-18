package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.Models.Conductor;
import com.schoolbus.schoolbusapp.Models.Parent;
import com.schoolbus.schoolbusapp.Models.User;
import com.schoolbus.schoolbusapp.Repositories.UserRepository;
import com.schoolbus.schoolbusapp.Services.AuthService;
import com.schoolbus.schoolbusapp.Services.CustomUserDetailsService;
import com.schoolbus.schoolbusapp.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final AuthService authService;
    private final  PasswordEncoder passwordEncoder;
    private final  UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                          CustomUserDetailsService userDetailsService, AuthService authService, PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getPhoneNo() != null ? user.getPhoneNo() : user.getEmail(), user.getPassword()));

            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getPhoneNo() != null ? user.getPhoneNo() : user.getEmail());

            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(Map.of("token", token));

        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Invalid phone number/email or password");
        }
    }

    @PostMapping("/login-parent")
    public ResponseEntity<?> login(@RequestBody Parent parent) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(parent.getPhoneNo() != null ? parent.getPhoneNo() : parent.getEmail(), parent.getPassword()));

            UserDetails userDetails = userDetailsService.loadUserByUsername(parent.getPhoneNo() != null ? parent.getPhoneNo() : parent.getEmail());

            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(Map.of("token", token));

        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Invalid phone number/email or password");
        }
    }

    @PostMapping("/login-conductor")
    public ResponseEntity<?> login(@RequestBody Conductor conductor) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(conductor.getPhoneNo() != null ? conductor.getPhoneNo() : conductor.getEmail(), conductor.getPassword()));

            UserDetails userDetails = userDetailsService.loadUserByUsername(conductor.getPhoneNo() != null ? conductor.getPhoneNo() : conductor.getEmail());

            String token = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(Map.of("token", token));

        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Invalid phone number/email or password");
        }
    }




    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = authService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}

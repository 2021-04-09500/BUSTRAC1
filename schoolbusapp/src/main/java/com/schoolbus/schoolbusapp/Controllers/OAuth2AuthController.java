package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.Models.User;
import com.schoolbus.schoolbusapp.Repositories.UserRepository;
import com.schoolbus.schoolbusapp.Security.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class OAuth2AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public OAuth2AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/google-success")
    public void googleLogin(@AuthenticationPrincipal OAuth2User principal, HttpServletResponse response) throws IOException {
        System.out.println("Google OAuth2 success callback triggered");
        String email = principal.getAttribute("email");
        System.out.println("User email: " + email);
        String name = principal.getAttribute("name");

        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPhoneNo(null);
            user.setPassword("");
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user);
        String redirectUrl = "http://localhost:3000/auth/callback?token=" + token;

        response.sendRedirect(redirectUrl);
    }
}
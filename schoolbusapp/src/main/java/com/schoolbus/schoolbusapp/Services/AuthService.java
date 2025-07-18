package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.Models.User;
import com.schoolbus.schoolbusapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {

        if (user.getPhoneNo() != null && !user.getPhoneNo().isEmpty() && userRepository.existsByPhoneNo(user.getPhoneNo())) {
            throw new RuntimeException("Error: Phone number is already in use!");
        }


        if (user.getEmail() != null && !user.getEmail().isEmpty() && userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }


        user.setPassword(passwordEncoder.encode(user.getPassword()));


        return userRepository.save(user);
    }
}
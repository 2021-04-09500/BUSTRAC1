package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.DTO.UserDTO;
import com.schoolbus.schoolbusapp.Models.User;
import com.schoolbus.schoolbusapp.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setPhoneNo(userDTO.getPhoneNo());
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(userDTO.getPassword()));
        return userRepository.save(user);
    }

    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public User updateUser(String id, User userDetails){
        User user=userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with ID: "+id));



        if (userDetails.getName() != null){
            user.setName(userDetails.getName());
        }


        if(userDetails.getPhoneNo() != null){
            user.setPhoneNo(userDetails.getPhoneNo());
        }

        if (userDetails.getPassword() != null){
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            user.setPassword(encoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(user);

    }

    public User findByEmailOrPhone(String input) {
        return userRepository.findByEmail(input)
                .or(() -> userRepository.findByPhoneNo(input))
                .orElse(null);
    }


}

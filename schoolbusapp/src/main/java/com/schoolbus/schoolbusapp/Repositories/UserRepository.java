package com.schoolbus.schoolbusapp.Repositories;

import com.schoolbus.schoolbusapp.Models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByName(String name);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNo(String phoneNo);
    boolean existsByName(String name);
    boolean existsByEmail(String email);
    boolean existsByPhoneNo(String phoneNo);

    List<User> findByRole(String role);

}

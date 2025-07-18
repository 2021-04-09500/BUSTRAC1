package com.schoolbus.schoolbusapp.Repositories;

import com.schoolbus.schoolbusapp.Models.Parent;
import com.schoolbus.schoolbusapp.Models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ParentRepository extends MongoRepository<Parent,String> {
    Optional<Parent> findByName(String name);
    Optional<Parent> findByEmail(String email);
    Optional<Parent> findByPhoneNo(String phoneNo);
    boolean existsByName(String name);
    boolean existsByEmail(String email);
    boolean existsByPhoneNo(String phoneNo);

    List<User> findByRole(String role);
    List<Parent> findByAddressNotNull();

}

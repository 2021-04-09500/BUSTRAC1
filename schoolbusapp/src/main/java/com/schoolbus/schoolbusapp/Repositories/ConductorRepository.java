package com.schoolbus.schoolbusapp.Repositories;

import com.schoolbus.schoolbusapp.Models.Conductor;
import com.schoolbus.schoolbusapp.Models.Parent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ConductorRepository extends MongoRepository<Conductor,String> {
    Optional<Conductor> findByName(String name);
    Optional<Conductor> findByEmail(String email);
    Optional<Conductor> findByPhoneNo(String phoneNo);
    boolean existsByName(String name);
    boolean existsByEmail(String email);
    boolean existsByPhoneNo(String phoneNo);
}

package com.schoolbus.schoolbusapp.Repositories;

import com.schoolbus.schoolbusapp.Models.Bus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusRepository extends MongoRepository<Bus, String> {
    Optional<Bus> findById(String id);
    Optional<Bus> findByRoute(String route);
}

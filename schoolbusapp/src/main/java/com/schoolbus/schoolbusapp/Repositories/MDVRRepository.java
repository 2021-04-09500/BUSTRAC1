package com.schoolbus.schoolbusapp.Repositories;

import com.schoolbus.schoolbusapp.Models.MDVR;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MDVRRepository extends MongoRepository<MDVR,String> {
    Optional<MDVR> findTopByBusIdOrderByCreatedAtDesc(String busId);
}

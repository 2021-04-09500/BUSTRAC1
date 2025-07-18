package com.schoolbus.schoolbusapp.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


public interface ConductorRouteHistoryRepository extends MongoRepository<ConductorRouteHistoryRepository, String> {
}

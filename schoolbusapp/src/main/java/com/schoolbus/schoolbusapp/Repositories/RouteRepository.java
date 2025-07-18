package com.schoolbus.schoolbusapp.Repositories;

import com.schoolbus.schoolbusapp.Models.Route;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RouteRepository extends MongoRepository<Route,String> {
    Optional<Route> findByBusId(String busId);

}

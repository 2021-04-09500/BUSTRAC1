package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.Models.Route;
import com.schoolbus.schoolbusapp.Repositories.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class RouteService {
    @Autowired
    private RouteRepository routeRepository;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public Route createRoute(Route route) {
        try {
            String now = dateFormat.format(new Date());
            if (route.getCreatedAt() == null) route.setCreatedAt(now);
            route.setUpdatedAt(now);
            System.out.println("Saving route: " + route.toString());
            return routeRepository.save(route);
        } catch (Exception e) {
            System.err.println("Error saving route: " + e.getMessage());
            throw new RuntimeException("Failed to save route", e);
        }
    }

    public List<Route> getAllRoutes() {
        try {
            return routeRepository.findAll();
        } catch (Exception e) {
            System.err.println("Error fetching routes: " + e.getMessage());
            throw new RuntimeException("Failed to fetch routes", e);
        }
    }

    public Route getRouteById(String id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found with ID: " + id));
    }

    public Route getRouteByBusId(String busId) {
        return routeRepository.findByBusId(busId)
                .orElseThrow(() -> new RuntimeException("Route not found for busId: " + busId));
    }
    public void deleteRoute(String id) {
        routeRepository.deleteById(id);
    }
}
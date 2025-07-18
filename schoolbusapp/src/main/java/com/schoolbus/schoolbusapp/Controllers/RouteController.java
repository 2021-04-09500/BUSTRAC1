package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.Models.Route;
import com.schoolbus.schoolbusapp.Services.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routes")
@CrossOrigin(origins = "http://localhost:3000")
public class RouteController {
    @Autowired
    private RouteService routeService;

    @PostMapping
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        try {
            Route newRoute = routeService.createRoute(route);
            return ResponseEntity.ok(newRoute);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        try {
            return ResponseEntity.ok(routeService.getAllRoutes());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable String id) {
        try {
            Route route = routeService.getRouteById(id);
            return ResponseEntity.ok(route);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-bus/{busId}")
    public ResponseEntity<Route> getRouteByBusId(@PathVariable String busId) {
        try {
            Route route = routeService.getRouteByBusId(busId);
            return ResponseEntity.ok(route);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable String id) {
        routeService.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }
}
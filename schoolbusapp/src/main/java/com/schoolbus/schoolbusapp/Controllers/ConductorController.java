package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.DTO.ConductorDTO;
import com.schoolbus.schoolbusapp.DTO.ConductorUpdateRequest;
import com.schoolbus.schoolbusapp.Models.Conductor;
import com.schoolbus.schoolbusapp.Services.ConductorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/conductors")
public class ConductorController {

    @Autowired
    private ConductorService conductorService;

    @PostMapping
    public ResponseEntity<Conductor> createConductor(
            @RequestBody ConductorDTO conductor,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(conductorService.createConductor(conductor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateConductor(@PathVariable String id, @RequestBody ConductorUpdateRequest request) {
        try {
            Conductor updatedConductor = conductorService.updateConductor(id, request);
            return ResponseEntity.ok(updatedConductor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Conductor update failed: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getConductorById(@PathVariable String id) {
        Conductor conductor = conductorService.getConductorById(id);
        return ResponseEntity.ok(conductor);
    }

    @GetMapping
    public ResponseEntity<List<Conductor>> getAllConductors(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(conductorService.getAllConductors());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConductor(
            @PathVariable String id,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (conductorService.deleteConductor(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}


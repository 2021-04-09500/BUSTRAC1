package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.DTO.ParentDTO;
import com.schoolbus.schoolbusapp.DTO.ParentUpdateRequest;
import com.schoolbus.schoolbusapp.Models.Parent;
import com.schoolbus.schoolbusapp.Services.ParentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/parents")
public class ParentController {
    @Autowired
    private ParentService parentService;

    @PostMapping
    public ResponseEntity<Parent> createParent(ParentDTO parent) {
        return ResponseEntity.ok(parentService.createParent(parent));
    }

    @GetMapping("/me")
    public ResponseEntity<Parent> getMyAccount(@AuthenticationPrincipal UserDetails userDetails) {
        String emailOrPhone = userDetails.getUsername();
        Parent parent = parentService.getLoggedInParent(emailOrPhone);
        return ResponseEntity.ok(parent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateParent(@PathVariable String id, @RequestBody ParentUpdateRequest request) {
        try {
            Parent updatedParent = parentService.updateParent(id, request);
            return ResponseEntity.ok(updatedParent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parent update failed: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Parent> updateParentDetails(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ParentUpdateRequest request
    ) {
        String identifier = userDetails.getUsername();
        Parent updatedParent = parentService.updateParentDetails(identifier, request);
        return ResponseEntity.ok(updatedParent);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Parent> getParentById(@PathVariable String id) {
        try {
            Parent parent = parentService.getParentById(id);
            return ResponseEntity.ok(parent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Parent>> getAllParents() {
        return ResponseEntity.ok(parentService.getAllParents());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParent(@PathVariable String id) {
        if (parentService.deleteParent(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/distance-to-bus/{busId}")
    public ResponseEntity<Double> getDistanceToBus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String busId
    ) {
        try {
            Parent parent = parentService.getLoggedInParent(userDetails.getUsername());
            double distance = parentService.calculateDistanceToBus(parent, busId);
            return ResponseEntity.ok(distance);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


}

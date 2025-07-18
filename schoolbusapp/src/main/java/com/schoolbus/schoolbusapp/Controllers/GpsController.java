package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.DTO.LocationUpdateDTO;
import com.schoolbus.schoolbusapp.Models.Bus;
import com.schoolbus.schoolbusapp.Services.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gps")
public class GpsController {
    @Autowired
    private BusService busService;

    @PostMapping("/update")
    public ResponseEntity<String> update(@RequestBody LocationUpdateDTO dto) {
        busService.updateLocation(dto);
        return ResponseEntity.ok("Location updated");
    }

    @GetMapping("/bus/{id}")
    public ResponseEntity<Bus> getBus(@PathVariable String id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }
}

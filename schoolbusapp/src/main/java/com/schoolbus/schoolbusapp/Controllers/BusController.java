package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.Models.Bus;
import com.schoolbus.schoolbusapp.Models.Student;
import com.schoolbus.schoolbusapp.Models.Parent;
import com.schoolbus.schoolbusapp.Models.User;
import com.schoolbus.schoolbusapp.Repositories.BusRepository;
import com.schoolbus.schoolbusapp.Repositories.ParentRepository;
import com.schoolbus.schoolbusapp.Repositories.StudentRepository;
import com.schoolbus.schoolbusapp.Services.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/buses")
public class BusController {

    private final BusService busService;
    private final ParentRepository parentRepository;
    private final StudentRepository studentRepository;
    private final BusRepository busRepository;

    @Autowired
    public BusController(BusService busService, ParentRepository parentRepository, StudentRepository studentRepository, BusRepository busRepository) {
        this.busService = busService;
        this.parentRepository = parentRepository;
        this.studentRepository = studentRepository;
        this.busRepository = busRepository;
    }

    @PostMapping
    public ResponseEntity<Bus> registerBus(@RequestBody Bus bus) {
        return new ResponseEntity<>(busService.registerBus(bus), HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, String>> getBusDetailsByStudentId(@PathVariable String studentId) {
        try {
            Map<String, String> busDetails = busService.getBusDetailsByStudentId(studentId);
            return ResponseEntity.ok(busDetails);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/my-child-bus")
    public ResponseEntity<?> getBusDetailsForLoggedInParent(@AuthenticationPrincipal UserDetails userDetails) {
        String identifier = userDetails.getUsername();

        Optional<Parent> userOpt = parentRepository.findByEmail(identifier);
        if (userOpt.isEmpty()) {
            userOpt = parentRepository.findByPhoneNo(identifier);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parent not found.");
        }

        User user = userOpt.get();


        String parentId = user.getId();

        List<Student> students = studentRepository.findByParentId(parentId);
        if (students.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No students found for this parent.");
        }

        Student student = students.get(0);

        Optional<Bus> busOpt = busRepository.findByRoute(student.getRoute());
        if (busOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No bus found for student's route.");
        }

        Bus bus = busOpt.get();

        Map<String, String> response = new HashMap<>();
        response.put("plateNumber", bus.getPlateNumber());
        response.put("driverName", bus.getDriverName());
        response.put("driverPhone", bus.getDriverPhone());

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Bus>> getAllBuses() {
        try {
            return new ResponseEntity<>(busService.getAllBuses(), HttpStatus.OK);
        } catch (RuntimeException e) {
            System.err.println("Controller error fetching buses: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<Bus> getBusStatus(@PathVariable String id) {
        try {
            return ResponseEntity.ok(busService.getBusStatus(id));
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

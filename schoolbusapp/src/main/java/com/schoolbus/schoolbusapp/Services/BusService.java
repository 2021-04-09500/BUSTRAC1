package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.DTO.LocationUpdateDTO;
import com.schoolbus.schoolbusapp.Models.Bus;
import com.schoolbus.schoolbusapp.Models.Student;
import com.schoolbus.schoolbusapp.Repositories.BusRepository;
import com.schoolbus.schoolbusapp.Repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Bus registerBus(Bus bus) {
        try {
            bus.setLastUpdated(LocalDateTime.now());
            System.out.println("Registering bus: " + bus);
            return busRepository.save(bus);
        } catch (Exception e) {
            System.err.println("Error registering bus: " + e.getMessage());
            throw new RuntimeException("Failed to register bus", e);
        }
    }

    public List<Bus> getAllBuses() {
        try {
            List<Bus> buses = busRepository.findAll();
            System.out.println("Fetched buses: " + buses);
            return buses;
        } catch (Exception e) {
            System.err.println("Error fetching buses: " + e.getMessage());
            throw new RuntimeException("Failed to fetch buses", e);
        }
    }

    public Bus getBusById(String id) {
        return busRepository.findById(id).orElse(null);
    }

    public Bus getBusStatus(String busId) {
        Bus bus = getBusById(busId);
        if (bus == null) {
            throw new RuntimeException("Bus not found");
        }
        return bus;
    }

    @Transactional(readOnly = true)
    public Map<String, String> getBusDetailsByStudentId(String studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));


        Optional<Bus> bus = busRepository.findByRoute(student.getRoute());
        Bus busObj = bus.orElseThrow(() -> new RuntimeException("No bus found for route: " + student.getRoute()));


        Map<String, String> busDetails = new HashMap<>();
        busDetails.put("plateNumber", busObj.getPlateNumber());
        busDetails.put("driverName", busObj.getDriverName());
        busDetails.put("driverPhone", busObj.getDriverPhone());
        return busDetails;
    }

    public void updateLocation(LocationUpdateDTO dto) {
        Bus bus = busRepository.findById(dto.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        bus.setGeoLocation(new GeoJsonPoint(dto.getLongitude(), dto.getLatitude()));
        bus.setLastUpdated(LocalDateTime.now());
        busRepository.save(bus);
    }
}
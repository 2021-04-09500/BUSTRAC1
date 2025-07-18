package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.DTO.ConductorDTO;
import com.schoolbus.schoolbusapp.DTO.ConductorUpdateRequest;
import com.schoolbus.schoolbusapp.Models.Conductor;
import com.schoolbus.schoolbusapp.Repositories.ConductorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConductorService {
    @Autowired
    private ConductorRepository conductorRepository;

    public Conductor createConductor(ConductorDTO conductorDTO) {
        Conductor conductor = new Conductor();
        conductor.setName(conductorDTO.getName());
        conductor.setPhoneNo(conductorDTO.getPhoneNo());
        conductor.setRoute(conductorDTO.getRoute());
        conductor.setEmail(conductorDTO.getEmail());
        conductor.setRole(conductorDTO.getRole());

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        conductor.setPassword(encoder.encode(conductorDTO.getPassword()));

        return conductorRepository.save(conductor);
    }
    public List<Conductor> getAllConductors() {
        return conductorRepository.findAll();
    }

    public Conductor getConductorById(String id) {
        return conductorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conductor not found with id: " + id));
    }

    public Conductor updateConductor(String id, ConductorUpdateRequest request) {
        Conductor conductor = getConductorById(id);

        if (request.getName() != null) conductor.setName(request.getName());
        if (request.getPhoneNo() != null) conductor.setPhoneNo(request.getPhoneNo());
        if (request.getEmail() != null) conductor.setEmail(request.getEmail());
        if (request.getRoute() != null) conductor.setRoute(request.getRoute());

        return conductorRepository.save(conductor);
    }

    public boolean deleteConductor(String id) {
        if (conductorRepository.existsById(id)) {
            conductorRepository.deleteById(id);
            return true;
        }
        return false;
    }

}

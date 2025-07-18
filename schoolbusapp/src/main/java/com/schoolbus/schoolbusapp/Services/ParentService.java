package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.DTO.ParentDTO;
import com.schoolbus.schoolbusapp.DTO.ParentUpdateRequest;
import com.schoolbus.schoolbusapp.Models.Bus;
import com.schoolbus.schoolbusapp.Models.Parent;
import com.schoolbus.schoolbusapp.Models.User;
import com.schoolbus.schoolbusapp.Models.UserRole;
import com.schoolbus.schoolbusapp.Repositories.BusRepository;
import com.schoolbus.schoolbusapp.Repositories.ParentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParentService {
    @Autowired
    private ParentRepository parentRepository;

    public Parent getLoggedInParent(String identifier) {
        Optional<Parent> parentOpt = parentRepository.findByEmail(identifier);

        if (parentOpt.isEmpty()) {
            parentOpt = parentRepository.findByPhoneNo(identifier);
        }

        if (parentOpt.isEmpty()) {
            throw new RuntimeException("Parent not found with identifier: " + identifier);
        }

        User user = parentOpt.get();


        if (!(user instanceof Parent)) {
            throw new RuntimeException("User is not a Parent.");
        }

        return (Parent) user;
    }

    public Parent updateParent(String id, ParentUpdateRequest request) {
        Parent parent = getParentById(id);

        if (request.getName() != null) parent.setName(request.getName());
        if (request.getPhoneNumber() != null) parent.setPhoneNo(request.getPhoneNumber());
        if (request.getEmail() != null) parent.setEmail(request.getEmail());
        if (request.getAddress() != null) parent.setAddress(request.getAddress());

        return parentRepository.save(parent);
    }

    public Parent updateParentDetails(String identifier, ParentUpdateRequest request) {
        Parent parent = getLoggedInParent(identifier);

        if (request.getName() != null) {
            parent.setName(request.getName());
        }
        if (request.getPhoneNumber() != null) {
            parent.setPhoneNo(request.getPhoneNumber());
        }
        if (request.getEmail() != null) {
            parent.setEmail(request.getEmail());
        }

        if (request.getAddress() != null) {
            parent.setAddress(request.getAddress());
        }



        return parentRepository.save(parent);
    }

    public Parent findByEmailOrPhone(String input) {
        return parentRepository.findByEmail(input)
                .or(() -> parentRepository.findByPhoneNo(input))
                .map(user -> (Parent) user)
                .orElse(null);

    }





    public Parent createParent(ParentDTO parentDTO) {
        if (parentRepository.findByEmail(parentDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Parent with this email already exists.");
        }
        if (parentRepository.findByPhoneNo(parentDTO.getPhoneNo()).isPresent()) {
            throw new IllegalArgumentException("Parent with this phone number already exists.");
        }

        Parent parent = new Parent();
        parent.setName(parentDTO.getName());
        parent.setPhoneNo(parentDTO.getPhoneNo());
        parent.setEmail(parentDTO.getEmail());
        parent.setPassword(new BCryptPasswordEncoder().encode(parentDTO.getPassword()));
        parent.setAddress(parentDTO.getAddress());
        parent.setRole(UserRole.valueOf(parentDTO.getRole()));

        return parentRepository.save(parent);
    }


    public Parent getParentById(String id) {
        Optional<Parent> parent = parentRepository.findById(id);
        return parent.orElseThrow(() -> new RuntimeException("Parent not found with id: " + id));
    }



    public List<Parent> getAllParents() {
        return parentRepository.findAll();
    }

    public boolean deleteParent(String id) {
        if (parentRepository.existsById(id)) {
            parentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Autowired
    private BusRepository busRepository;

    public double calculateDistanceToBus(Parent parent, String busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        if (parent.getAddress() == null || bus.getGeoLocation() == null) {
            throw new RuntimeException("Missing coordinates");
        }

        double lat1 = parent.getAddress().getLatitude();
        double lon1 = parent.getAddress().getLongitude();

        double lat2 = bus.getGeoLocation().getY();
        double lon2 = bus.getGeoLocation().getX();

        return haversine(lat1, lon1, lat2, lon2);
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }



}

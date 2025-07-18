package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.Models.User;
import com.schoolbus.schoolbusapp.Models.Parent;
import com.schoolbus.schoolbusapp.Models.Conductor;
import com.schoolbus.schoolbusapp.Repositories.UserRepository;
import com.schoolbus.schoolbusapp.Repositories.ParentRepository;
import com.schoolbus.schoolbusapp.Repositories.ConductorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final ConductorRepository conductorRepository;

    @Autowired
    public CustomUserDetailsService(
            UserRepository userRepository,
            ParentRepository parentRepository,
            ConductorRepository conductorRepository
    ) {
        this.userRepository = userRepository;
        this.parentRepository = parentRepository;
        this.conductorRepository = conductorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {

        Optional<User> userOpt = userRepository.findByPhoneNo(input);
        if (userOpt.isEmpty()) userOpt = userRepository.findByEmail(input);
        if (userOpt.isPresent()) return userOpt.get();


        Optional<Parent> parentOpt = parentRepository.findByPhoneNo(input);
        if (parentOpt.isEmpty()) parentOpt = parentRepository.findByEmail(input);
        if (parentOpt.isPresent()) return parentOpt.get();


        Optional<Conductor> conductorOpt = conductorRepository.findByPhoneNo(input);
        if (conductorOpt.isEmpty()) conductorOpt = conductorRepository.findByEmail(input);
        if (conductorOpt.isPresent()) return conductorOpt.get();


        throw new UsernameNotFoundException("User not found with phone or email: " + input);
    }
}

package com.schoolbus.schoolbusapp.DTO;

import com.schoolbus.schoolbusapp.Models.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public record UserDTOO(String name, UserRole role) {}


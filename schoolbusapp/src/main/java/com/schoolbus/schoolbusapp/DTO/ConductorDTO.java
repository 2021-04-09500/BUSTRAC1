package com.schoolbus.schoolbusapp.DTO;

import lombok.Data;

@Data
public class ConductorDTO extends UserDTO {
    private String email;
    private String route;
}
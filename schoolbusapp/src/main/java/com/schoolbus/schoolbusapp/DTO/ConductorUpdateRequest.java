package com.schoolbus.schoolbusapp.DTO;

import lombok.Data;

@Data
public class ConductorUpdateRequest {
    private String name;
    private String phoneNo;
    private String email;
    private String route;
}

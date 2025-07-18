package com.schoolbus.schoolbusapp.DTO;

import lombok.Data;

@Data
public class StudentUpdateRequest {
    private String name;
    private String grade;
    private String route;
}

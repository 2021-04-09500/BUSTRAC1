package com.schoolbus.schoolbusapp.DTO;

import lombok.Data;

@Data
public class StudentDTO extends UserDTO {
    private String route;
    private String grade;
}
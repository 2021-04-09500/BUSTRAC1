package com.schoolbus.schoolbusapp.DTO;

import com.schoolbus.schoolbusapp.Models.Coordinate;
import lombok.Data;

@Data
public class ParentDTO {
    private String name;
    private String phoneNo;
    private String email;
    private String password;
    private Coordinate address;
    private String role;
}

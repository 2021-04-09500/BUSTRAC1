package com.schoolbus.schoolbusapp.DTO;

import com.schoolbus.schoolbusapp.Models.Coordinate;
import lombok.Data;

@Data
public class ParentUpdateRequest {
    private String name;
    private String phoneNumber;
    private String email;
    private Coordinate address;

}

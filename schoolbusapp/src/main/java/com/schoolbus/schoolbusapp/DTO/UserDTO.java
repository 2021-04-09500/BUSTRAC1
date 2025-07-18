package com.schoolbus.schoolbusapp.DTO;

import com.schoolbus.schoolbusapp.Models.UserRole;
import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String password;
    private String email;
    private UserRole role;
   private String phoneNo;

}
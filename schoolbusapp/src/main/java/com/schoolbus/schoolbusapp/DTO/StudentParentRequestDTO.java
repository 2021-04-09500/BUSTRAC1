package com.schoolbus.schoolbusapp.DTO;

import com.schoolbus.schoolbusapp.DTO.ParentDTO;
import com.schoolbus.schoolbusapp.DTO.StudentDTO;
import jakarta.validation.Valid;
import lombok.Data;




@Data
public class StudentParentRequestDTO {


    @Valid
    private StudentDTO student;


    @Valid
    private ParentDTO parent;
}
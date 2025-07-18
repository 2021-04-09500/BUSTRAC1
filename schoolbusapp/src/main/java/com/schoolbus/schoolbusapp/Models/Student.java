package com.schoolbus.schoolbusapp.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "students")
public class Student extends User {

    private String grade;
    private String parentId;
    private String route;

    @Indexed(unique = true)
    private String combinationKey;



}

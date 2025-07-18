package com.schoolbus.schoolbusapp.Models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Coordinate {
    @Field("latitude")
    private double latitude;

    @Field("longitude")
    private double longitude;
}

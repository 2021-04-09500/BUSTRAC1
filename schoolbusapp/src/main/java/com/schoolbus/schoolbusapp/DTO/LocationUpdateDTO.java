package com.schoolbus.schoolbusapp.DTO;


import lombok.Data;

@Data
public class LocationUpdateDTO {
    private String busId;
    private double latitude;
    private double longitude;
}



package com.schoolbus.schoolbusapp.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bus")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Bus {
    @Id
    private String id;
    private String plateNumber;
    private String model;
    private String currentLocation;
    private GeoJsonPoint geoLocation;
    private String videoFeedUrl;
    private String speed;
    private String route;
    private int studentsOnBoard;
    private String driverName;
    private String driverPhone;
    private LocalDateTime lastUpdated;
}
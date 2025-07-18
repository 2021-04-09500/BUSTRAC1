package com.schoolbus.schoolbusapp.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "routes")
public class Route {

    @Id
    private String id;

    private String name;
    private Coordinate startLocation;
    private Coordinate endLocation;
    private String busId;
    private List<Coordinate> coordinates;
    private List<Waypoint> waypoints;


    private double distance;
    private int estimatedTime;
    private String status;
    private String createdAt;
    private String updatedAt;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Coordinate {
        private double latitude;
        private double longitude;
    }


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Waypoint {
        private String name;
        private double latitude;
        private double longitude;
    }
}
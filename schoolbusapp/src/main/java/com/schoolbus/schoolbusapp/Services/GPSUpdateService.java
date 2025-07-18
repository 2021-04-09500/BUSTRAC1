// src/main/java/com/schoolbus/schoolbusapp/Services/GPSUpdateService.java
package com.schoolbus.schoolbusapp.Services;

import com.schoolbus.schoolbusapp.Models.Bus;
import com.schoolbus.schoolbusapp.Repositories.BusRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;

@Service
public class GPSUpdateService {

    @Autowired
    private BusRepository busRepository;


    private final String piIp = "192.168.134.97";
    private final String busId = "680b6b964b3ec354b671fdd3";

    @Scheduled(fixedRate = 1000)
    public void fetchAndUpdateLocation() {
        String endpoint = "http://" + piIp + ":5000/gps";
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(endpoint)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JSONObject gps = new JSONObject(response.body());
            double lat = gps.getDouble("lat");
            double lon = gps.getDouble("lon");

            Bus bus = busRepository.findById(busId)
                    .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + busId));

            bus.setGeoLocation(new GeoJsonPoint(lon, lat));
            bus.setCurrentLocation("Lat: " + lat + ", Lon: " + lon);
            bus.setLastUpdated(LocalDateTime.now());
            busRepository.save(bus);

            System.out.println("Bus location updated successfully: Lat=" + lat + ", Lon=" + lon);
        } catch (Exception e) {
            System.err.println("Error updating GPS location: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
package com.schoolbus.schoolbusapp.Controllers;

import com.schoolbus.schoolbusapp.Models.Bus;
import com.schoolbus.schoolbusapp.Repositories.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/bus")
public class BusTrackingController {

    private static final Logger LOGGER = Logger.getLogger(BusTrackingController.class.getName());

    @Autowired
    private BusRepository busRepository;

    @GetMapping("/{id}/location")
    public ResponseEntity<LocationResponse> getLocation(@PathVariable String id) {
        LOGGER.info("Starting location fetch for bus ID: " + id);
        try {
            Bus bus = busRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + id));
            LOGGER.info("Bus found: " + bus.getId());

            GeoJsonPoint geoLocation = bus.getGeoLocation();
            if (geoLocation == null) {
                LOGGER.severe("geoLocation is null for bus ID: " + id);
                return ResponseEntity.status(404).body(null);
            }

            double lng = geoLocation.getX();
            double lat = geoLocation.getY();
            LOGGER.info("Extracted coordinates - lat: " + lat + ", lng: " + lng);

            LocationResponse response = new LocationResponse(lat, lng);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LOGGER.severe("Critical error in getLocation for bus ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}/video-url")
    public ResponseEntity<String> getVideoUrl(@PathVariable String id) {
        LOGGER.info("Fetching video URL for bus ID: " + id);
        try {
            Bus bus = busRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Bus not found with ID: " + id));
            String videoUrl = bus.getVideoFeedUrl() != null ? bus.getVideoFeedUrl() : "No video feed available";
            LOGGER.info("Video URL fetched: " + videoUrl);
            return ResponseEntity.ok(videoUrl);
        } catch (RuntimeException e) {
            LOGGER.severe("Error fetching video URL for bus ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(500).body("Error retrieving video URL");
        }
    }

    // Inner class for location response
    public static class LocationResponse {
        private final double lat;
        private final double lng;

        public LocationResponse(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public double getLat() {
            return lat;
        }

        public double getLng() {
            return lng;
        }

        @Override
        public String toString() {
            return "LocationResponse{lat=" + lat + ", lng=" + lng + "}";
        }
    }
}

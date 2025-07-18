"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { getRouteById, Route } from "@/app/services/routeService";
import { fetchBusLocation } from "@/app/services/busService";

interface MapProps {
  routeId: string;
}

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
};

const defaultCenter = {
  lat: -6.7924,
  lng: 39.2083,
};

interface BusLocation {
  lat: number;
  lng: number;
  currentLocation: string;
  timestamp: string;
}

const Map: React.FC<MapProps> = ({ routeId }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const data = await getRouteById(routeId);
        setRoute(data);
      } catch (err: any) {
        console.error("Error fetching route:", err);
        setError(err.message);
      }
    };
    fetchRoute();
  }, [routeId]);

  
  useEffect(() => {
    const fetchBus = async () => {
      try {
        if (!route?.busId) return;
        const location = await fetchBusLocation(route.busId);
        setBusLocation(location);
      } catch (err: any) {
        console.error("Error fetching bus location:", err);
        setBusLocation(null);
      }
    };

    fetchBus();
    const interval = setInterval(fetchBus, 5000);
    return () => clearInterval(interval);
  }, [route?.busId]);

  
  useEffect(() => {
    if (!route || !window.google || !route.endLocation || !busLocation) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: {
          lat: busLocation.lat,
          lng: busLocation.lng,
        },
        destination: {
          lat: route.endLocation.latitude,
          lng: route.endLocation.longitude,
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          const leg = result.routes[0]?.legs[0];
          if (leg) {
            setEta(leg.duration?.text || null);
            setDistance(leg.distance?.text || null);
          }
        } else {
          console.error("Directions request failed due to", status);
        }
      }
    );
  }, [busLocation, route?.endLocation]);

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyAQ-fKSiCLJsG9xc_T1WgAowRyaBqliJTg">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={
            route?.startLocation
              ? { lat: route.startLocation.latitude, lng: route.startLocation.longitude }
              : defaultCenter
          }
          zoom={14}
          onLoad={onLoad}
          options={{
            zoomControl: true,
            fullscreenControl: true,
            mapTypeControl: false,
            streetViewControl: false,
          }}
        >
          
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#1A237E",
                  strokeWeight: 5,
                },
                preserveViewport: true, 
              }}
            />
          )}

          
          {busLocation && (
            <Marker
              position={{ lat: busLocation.lat, lng: busLocation.lng }}
              icon={{
                url: "/bus-icon.png",
                scaledSize: new window.google.maps.Size(38, 38),
              }}
            >
              <InfoWindow position={{ lat: busLocation.lat, lng: busLocation.lng }}>
                <div>
                  <h4>🚌 School Bus</h4>
                  <p>{busLocation.currentLocation}</p>
                </div>
              </InfoWindow>
            </Marker>
          )}
        </GoogleMap>
      </LoadScript>

      {/* ETA & Distance */}
      {(eta || distance) && (
        <div
          style={{
            marginTop: "12px",
            padding: "12px 16px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#333",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {distance && <p>📏 Distance: <strong>{distance}</strong></p>}
          {eta && <p>🕒 Estimated Time: <strong>{eta}</strong></p>}
        </div>
      )}

      {error && (
        <div style={{ color: "red", paddingTop: "10px" }}>
          Error loading map: {error}
        </div>
      )}
    </div>
  );
};

export default Map;

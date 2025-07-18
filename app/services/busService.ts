"use client";
import { apiRequest } from './authService';

export interface Bus {
  id: string;
  plateNumber: string;
  model: string;
  currentLocation: string;
  geoLocation: {
    type: string;
    coordinates: [number, number]; 
  };
  speed: string;
  route: string;
  driverName: string;
  driverPhone: string;
}

export interface BusLocation {
  lat: number;
  lng: number;
  timestamp: string;
  currentLocation: string;
}


export const addBus = async (bus: Omit<Bus, 'id'>): Promise<Bus> => {
  return await apiRequest('/buses', 'post', bus);
};


export const getAllBuses = async (): Promise<Bus[]> => {
  return await apiRequest('/buses', 'get');
};


export const updateBus = async (id: string, updatedBus: Partial<Bus>): Promise<Bus> => {
  return await apiRequest(`/buses/${id}`, 'put', updatedBus);
};

export const deleteBus = async (id: string): Promise<void> => {
  return await apiRequest(`/buses/${id}`, 'delete');
};


export const fetchBusLocation = async (busId: string): Promise<BusLocation> => {
  const res = await fetch(`http://localhost:8081/api/bus/${busId}/location`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch bus location: ${res.status} - ${errorText}`);
  }

  const data = await res.json();

  const lat = typeof data.lat === "string" ? parseFloat(data.lat) : data.lat;
  const lng = typeof data.lng === "string" ? parseFloat(data.lng) : data.lng;

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error("Invalid coordinates from backend");
  }

  return {
    lat,
    lng,
    timestamp: new Date().toISOString(),
    currentLocation: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
  };
};

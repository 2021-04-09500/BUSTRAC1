"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./newRouteModal.module.css";
import { Route, Bus, getAllBuses, addRoute } from "@/app/services/routeService";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface NewRouteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRouteAdded: (newRoute: Route) => void;
}

interface Coordinate {
    latitude: number;
    longitude: number;
}

const NewRouteModal: React.FC<NewRouteModalProps> = ({ isOpen, onClose, onRouteAdded }) => {
    const [routeName, setRouteName] = useState("");
    const [startLocation, setStartLocation] = useState<Coordinate>({ latitude: -6.7924, longitude: 39.2083 });
    const [endLocation, setEndLocation] = useState<Coordinate>({ latitude: -6.792354, longitude: 39.208354 });
    const [assignedBusId, setAssignedBusId] = useState("");
    const [distance, setDistance] = useState<number | "">("");
    const [estimatedTime, setEstimatedTime] = useState<number | "">("");
    const [status, setStatus] = useState("active");
    const [buses, setBuses] = useState<Bus[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchBuses().catch((err) => {
                console.error("Fetch buses error:", err);
                setError("Failed to load buses. Check console for details.");
            });
        }
    }, [isOpen]);

    const fetchBuses = async () => {
        try {
            console.log("Fetching buses...");
            const data = await getAllBuses();
            console.log("Fetched buses data:", data);
            if (!Array.isArray(data)) {
                throw new Error("Invalid bus data format: expected an array");
            }
            setBuses(data);
        } catch (err) {
            console.error("Failed to fetch buses:", err);
            setError("Failed to load buses. Check console for details.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newRoute: Omit<Route, "id" | "coordinates" | "waypoints" | "createdAt" | "updatedAt"> = {
            name: routeName,
            startLocation,
            endLocation,
            busId: assignedBusId || undefined,
            distance: typeof distance === "string" ? (distance ? Number(distance) : undefined) : distance,
            estimatedTime: typeof estimatedTime === "string" ? (estimatedTime ? Number(estimatedTime) : undefined) : estimatedTime,
            status,
        };

        try {
            console.log("Submitting route payload:", newRoute);
            const createdRoute = await addRoute(newRoute);
            onRouteAdded(createdRoute);
            setMessage("Route registered successfully!");
            clearForm();
            setTimeout(() => {
                setMessage(null);
                onClose();
            }, 2000);
        } catch (err) {
            console.error("Error adding route:", err);
            setError(`Failed to register route: ${err.message || "Unknown error"}. Check console.`);
            setTimeout(() => setError(null), 3000);
        }
    };

    const clearForm = () => {
        setRouteName("");
        setStartLocation({ latitude: -6.7924, longitude: 39.2083 });
        setEndLocation({ latitude: -6.792354, longitude: 39.208354 });
        setAssignedBusId("");
        setDistance("");
        setEstimatedTime("");
        setStatus("active");
    };

    const LocationMarker = ({ setLocation }: { setLocation: (coord: Coordinate) => void }) => {
        const [position, setPosition] = useState<L.LatLngExpression>([startLocation.latitude, startLocation.longitude]);
        const map = useMapEvents({
            click(e) {
                if (e.latlng) {
                    const newPos = [e.latlng.lat, e.latlng.lng] as L.LatLngExpression;
                    setPosition(newPos);
                    setLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
                    console.log("Map clicked at:", e.latlng);
                }
            },
            dragend(e) {
                if (e.target) {
                    const newPos = e.target.getLatLng();
                    setPosition([newPos.lat, newPos.lng]);
                    setLocation({ latitude: newPos.lat, longitude: newPos.lng });
                    console.log("Marker dragged to:", newPos);
                }
            },
        });

        return <Marker position={position} draggable={true} />;
    };

    if (!isOpen) return null;

    if (typeof L === "undefined") {
        console.error("Leaflet is not loaded. Ensure dependencies are installed.");
        return <div>Error: Map library not loaded. Check console.</div>;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.closeButton}>
                    ×
                </button>
                <h2>Add New Route</h2>

                {message && <p className={styles.successMessage}>{message}</p>}
                {error && <p className={styles.errorMessage}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Route Name"
                        className={styles.input}
                        value={routeName}
                        onChange={(e) => setRouteName(e.target.value)}
                        required
                    />
                    <div className={styles.mapSection}>
                        <h3>Start Location</h3>
                        <MapContainer
                            center={[startLocation.latitude, startLocation.longitude]}
                            zoom={13}
                            className={styles.leafletContainer}
                            style={{ height: "200px" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker setLocation={setStartLocation} />
                        </MapContainer>
                        <p>Lat: {startLocation.latitude.toFixed(4)}, Lng: {startLocation.longitude.toFixed(4)}</p>
                    </div>
                    <div className={styles.mapSection}>
                        <h3>End Location</h3>
                        <MapContainer
                            center={[endLocation.latitude, endLocation.longitude]}
                            zoom={13}
                            className={styles.leafletContainer}
                            style={{ height: "200px" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationMarker setLocation={setEndLocation} />
                        </MapContainer>
                        <p>Lat: {endLocation.latitude.toFixed(4)}, Lng: {endLocation.longitude.toFixed(4)}</p>
                    </div>
                    <select
                        className={styles.input}
                        value={assignedBusId}
                        onChange={(e) => setAssignedBusId(e.target.value)}
                        required
                    >
                        <option value="">Assign a Bus</option>
                        {buses.length === 0 ? (
                            <option disabled>No buses available</option>
                        ) : (
                            buses.map((bus) => (
                                <option key={bus.id} value={bus.id}>
                                    {bus.plateNumber}
                                </option>
                            ))
                        )}
                    </select>
                    <input
                        type="number"
                        placeholder="Distance (km)"
                        className={styles.input}
                        value={distance === "" ? "" : String(distance)}
                        onChange={(e) => setDistance(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Estimated Time (min)"
                        className={styles.input}
                        value={estimatedTime === "" ? "" : String(estimatedTime)}
                        onChange={(e) => setEstimatedTime(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                    <select
                        className={styles.input}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="scheduled">Scheduled</option>
                    </select>
                    <button type="submit" className={styles.submitButton}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewRouteModal;
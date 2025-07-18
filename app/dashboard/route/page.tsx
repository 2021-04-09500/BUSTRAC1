"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/route/routes.module.css";
import NewRouteModal from "@/app/ui/dashboard/route/newRoute/newRouteModal";
import NewBusModal from "@/app/ui/dashboard/route/newBus/newBusModal";
import Map from "@/app/ui/dashboard/route/map/map";
import { getAllRoutes, Route } from "@/app/services/routeService";
import Loading from "@/app/ui/Loading/Loading";
import { FaEye } from "react-icons/fa";

const Routes: React.FC = () => {
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        console.log("Starting route fetch...");
        const data = await getAllRoutes();
        console.log("Raw fetched routes data:", data);
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: expected an array of routes");
        }
        // Validate each route has required fields
        const validRoutes = data.filter((route): route is Route => {
          const isValid = route && typeof route.name === "string" && route.startLocation && route.endLocation;
          if (!isValid) console.warn("Invalid route found:", route);
          return isValid;
        });
        setRoutes(validRoutes);
        if (validRoutes.length > 0) setSelectedRoute(validRoutes[0]);
        else console.log("No valid routes found");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError(`Failed to fetch routes: ${err.message || "Unknown error"}`);
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handleOpenRouteModal = () => setIsRouteModalOpen(true);
  const handleCloseRouteModal = () => setIsRouteModalOpen(false);

  const handleOpenBusModal = () => setIsBusModalOpen(true);
  const handleCloseBusModal = () => setIsBusModalOpen(false);

  const handleRouteAdded = (newRoute: Route) => {
    console.log("Adding new route:", newRoute);
    setRoutes((prev) => [...prev, newRoute]);
    if (!selectedRoute) setSelectedRoute(newRoute);
  };

  const handleViewRoute = (route: Route) => {
    console.log("Viewing route:", route);
    setSelectedRoute(route);
  };

  return (
    <div className={styles.container}>
      <div className={styles.routesListCard}>
        <div className={styles.cardHeader}>
          <h2>List of Routes</h2>
        </div>
        <div className={styles.actions}>
          <button className={styles.newRouteButton} onClick={handleOpenRouteModal}>
            New Route
          </button>
          <button className={styles.newRouteButton} onClick={handleOpenBusModal}>
            Add Bus
          </button>
        </div>
        {loading ? (
          <div className={styles.localLoader}>
            <Loading />
          </div>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <table className={styles.routesTable}>
            <thead>
              <tr>
                <th>Route</th>
                
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.length > 0 ? (
                routes.map((route) => (
                  <tr key={route.id}>
                    <td>{route.name || "Unnamed"}</td>
                   
                    <td>{route.status || "N/A"}</td>
                    <td>
                      <button
                        className={styles.viewButton}
                        onClick={() => handleViewRoute(route)}
                        title="View Route"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No routes found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className={styles.mapCard}>
  <div className={styles.cardHeader}>
    <h2>
      {selectedRoute?.name || "No route selected"}
    </h2>
  </div>
  
  {selectedRoute?.id ? (
    <Map routeId={selectedRoute.id} />
  ) : (
    <p>Please select a route to view the map.</p>
  )}
</div>

      <NewRouteModal
        isOpen={isRouteModalOpen}
        onClose={handleCloseRouteModal}
        onRouteAdded={handleRouteAdded}
      />
      <NewBusModal
        isOpen={isBusModalOpen}
        onClose={handleCloseBusModal}
        onBusAdded={(newBus) => {
          console.log("New bus registered:", newBus);
        }}
      />
    </div>
  );
};

export default Routes;
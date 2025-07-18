"use client";

import React, { useState, useEffect, useRef } from "react";
import { MDVRClientService } from "@/app/services/mdvrService";
import styles from "./mdvr.module.css";

const piIp = "192.168.134.97";

const VideoFeed = () => {
  const videoRef = useRef<HTMLImageElement>(null);

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch((err) => {
          console.error("Error entering full-screen mode:", err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className={styles.videoContainer}>
      <img
        ref={videoRef}
        src={`http://${piIp}:5000/video_feed`}
        style={{ width: "100%", border: "2px solid black", borderRadius: "8px" }}
        alt="Live Bus Camera"
      />
      <button className={styles.fullScreenButton} onClick={handleFullScreen}>
        {document.fullscreenElement ? "Exit Full Screen" : "Full Screen"}
      </button>
    </div>
  );
};

interface Bus {
  Id: string;
  plateNumber: string;
  model: string;
  currentLocation: string;
  speed: string;
  route: string;
  driverName: string;
  driverPhone: string;
}

const MDVRLiveView: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string>("");
  const [busStatus, setBusStatus] = useState<Bus | null>(null);
  const [error, setError] = useState<string>("");
  const [busStatusError, setBusStatusError] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const data = await MDVRClientService.getAllBuses();
        setBuses(data);
        if (data.length > 0) {
          setSelectedBusId(data[0].Id);
        }
      } catch (err: any) {
        setError("Failed to fetch buses: " + (err.message || "Unknown error"));
      }
    };
    fetchBuses();
  }, []);

  useEffect(() => {
    if (!selectedBusId) return;

    const fetchBusStatus = async () => {
      try {
        const status = await MDVRClientService.getBusStatus(selectedBusId);
        setBusStatus(status);
        setBusStatusError("");
      } catch (err: any) {
        setBusStatus(null);
        const errorMessage = err.message || "Unknown error";
        setBusStatusError("Failed to fetch bus status: " + errorMessage);
      }
    };

    fetchBusStatus();
    const interval = setInterval(fetchBusStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [selectedBusId]);

  const selectedBus = buses.find((bus) => bus.Id === selectedBusId);

  const handleStartRecording = () => {
    setIsRecording(true);
    console.log("Recording started for bus:", selectedBusId);
    // Add recording logic here (e.g., API call to start recording)
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    console.log("Recording stopped for bus:", selectedBusId);
    // Add recording stop logic here
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Live Inside View</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.layout}>
        <div className={styles.busSelection}>
          <h2>Select Bus</h2>
          <select
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className={styles.busDropdown}
          >
            {buses.map((bus) => (
              <option key={bus.Id} value={bus.Id}>
                Bus {bus.plateNumber} - {bus.driverName || "Unknown"}
              </option>
            ))}
          </select>

          {selectedBus && (
            <div className={styles.busInfo}>
              <p>
                <strong>Plate:</strong> {selectedBus.plateNumber}
              </p>
              <p>
                <strong>Driver:</strong> {selectedBus.driverName}
              </p>
              <p>
                <strong>Model:</strong> {selectedBus.model}
              </p>
            </div>
          )}
        </div>

        <div className={styles.mainContent}>
          <div className={styles.snapshotSection}>
            <h2>Live Stream</h2>
            <VideoFeed />
            <p className={styles.note}>
            
            </p>
            <div className={styles.liveStreamControls}>
              <button
                className={styles.startButton}
                onClick={handleStartRecording}
                disabled={isRecording}
              >
                Start Recording
              </button>
              <button
                className={styles.stopButton}
                onClick={handleStopRecording}
                disabled={!isRecording}
              >
                Stop Recording
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MDVRLiveView;
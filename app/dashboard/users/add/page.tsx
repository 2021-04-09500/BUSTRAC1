"use client";

import React, { useState } from 'react';
import styles from "@/app/ui/dashboard/users/addUser/addUser.module.css";
import { createStudentParent, createUser } from '@/app/services/userService';
import {
  GoogleMap,
  Marker,
  LoadScript,
  Autocomplete
} from "@react-google-maps/api";

const AddUserPage: React.FC = () => {
  const [userType, setUserType] = useState("STUDENT_PARENT");
  const [error, setError] = useState<string | null>(null);

  
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentRoute, setStudentRoute] = useState("");


  const [parentFullName, setParentFullName] = useState("");
  const [parentPhoneNo, setParentPhoneNo] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPassword, setParentPassword] = useState("");
  const [parentLocation, setParentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  
  const [conductorFullName, setConductorFullName] = useState("");
  const [conductorPhoneNo, setConductorPhoneNo] = useState("");
  const [conductorEmail, setConductorEmail] = useState("");
  const [conductorPassword, setConductorPassword] = useState("");
  const [conductorRoute, setConductorRoute] = useState("");

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserType(event.target.value);
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const loc = place.geometry.location;
        setParentLocation({ lat: loc.lat(), lng: loc.lng() });
      }
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setParentLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (userType === "STUDENT_PARENT") {
      if (!parentLocation) {
        setError("Please select a location on the map.");
        return;
      }

      const studentData = {
        name: studentName,
        grade: studentClass,
        route: studentRoute,
        role: "Student"
      };

      const parentData = {
        name: parentFullName,
        phoneNo: parentPhoneNo,
        email: parentEmail,
        password: parentPassword,
        address: {
          latitude: parentLocation.lat,
          longitude: parentLocation.lng
        },
        role: "Parent"
      };

      try {
        await createStudentParent({ student: studentData, parent: parentData });
        alert("Student and parent created successfully!");

        // ✅ Reset all form fields
        setStudentName("");
        setStudentClass("");
        setStudentRoute("");
        setParentFullName("");
        setParentPhoneNo("");
        setParentEmail("");
        setParentPassword("");
        setParentLocation(null);
        setAutocomplete(null);
      } catch (err: any) {
        setError(err.message || "Failed to create student and parent.");
      }
    } else if (userType === "CONDUCTOR") {
      const conductorData = {
        name: conductorFullName,
        phoneNo: conductorPhoneNo,
        email: conductorEmail,
        password: conductorPassword,
        route: conductorRoute,
        role: "Conductor"
      };

      try {
        await createUser(conductorData);
        alert("Conductor created successfully!");

        // ✅ Reset all conductor fields
        setConductorFullName("");
        setConductorPhoneNo("");
        setConductorEmail("");
        setConductorPassword("");
        setConductorRoute("");
      } catch (err: any) {
        setError(err.message || "Failed to create conductor.");
      }
    }
  };

  const renderForm = () => {
    switch (userType) {
      case "STUDENT_PARENT":
        return (
          <>
            <input type="text" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
            <input type="text" placeholder="Grade" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} required />
            <input type="text" placeholder="Route" value={studentRoute} onChange={(e) => setStudentRoute(e.target.value)} required />

            <input type="text" placeholder="Parent Full Name" value={parentFullName} onChange={(e) => setParentFullName(e.target.value)} required />
            <input type="phone" placeholder="Parent Phone Number" value={parentPhoneNo} onChange={(e) => setParentPhoneNo(e.target.value)} required />
            <input type="email" placeholder="Parent Email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} required />
            <input type="password" placeholder="Parent Password" value={parentPassword} onChange={(e) => setParentPassword(e.target.value)} required />

            <label>Search or Click to Set Parent Address:</label>
            <LoadScript googleMapsApiKey="AIzaSyAQ-fKSiCLJsG9xc_T1WgAowRyaBqliJTg" libraries={['places']}>
              <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
                <input
                  type="text"
                  placeholder="Search address..."
                  style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}
                />
              </Autocomplete>
              <GoogleMap
                mapContainerClassName={styles.mapContainer}
                center={parentLocation || { lat: -6.7924, lng: 39.2083 }}
                zoom={14}
                onClick={handleMapClick}
              >
                {parentLocation && <Marker position={parentLocation} />}
              </GoogleMap>
            </LoadScript>

            <button className={styles.button} type="submit">Add Student and Parent</button>
          </>
        );

      case "CONDUCTOR":
        return (
          <>
            <input type="text" placeholder="Full Name" value={conductorFullName} onChange={(e) => setConductorFullName(e.target.value)} required />
            <input type="phone" placeholder="Phone Number" value={conductorPhoneNo} onChange={(e) => setConductorPhoneNo(e.target.value)} required />
            <input type="email" placeholder="Email" value={conductorEmail} onChange={(e) => setConductorEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={conductorPassword} onChange={(e) => setConductorPassword(e.target.value)} required />
            <input type="text" placeholder="Route" value={conductorRoute} onChange={(e) => setConductorRoute(e.target.value)} required />
            <button className={styles.button} type="submit">Add Conductor</button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <select value={userType} onChange={handleUserTypeChange} className={styles.select}>
          <option value="STUDENT_PARENT">Student and Parent</option>
          <option value="CONDUCTOR">Conductor</option>
        </select>

        {renderForm()}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </form>
    </div>
  );
};

export default AddUserPage;

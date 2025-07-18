import React, { useState } from 'react';
import styles from './newBusModal.module.css';
import { addBus } from '@/app/services/busService';

interface Bus {
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

interface NewBusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBusAdded: (newBus: Bus) => void;
}

const NewBusModal: React.FC<NewBusModalProps> = ({ isOpen, onClose, onBusAdded }) => {
    const [plateNumber, setPlateNumber] = useState('');
    const [model, setModel] = useState('');
    const [currentLocation, setCurrentLocation] = useState('');
    const [latitude, setLatitude] = useState('0'); 
    const [longitude, setLongitude] = useState('0'); 
    const [speed, setSpeed] = useState('');
    const [route, setRoute] = useState('');
    const [driverName, setDriverName] = useState('');
    const [driverPhone, setDriverPhone] = useState('');

    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lon)) {
            setIsSuccess(false);
            setMessage('Latitude and Longitude must be valid numbers.');
            return;
        }

        const newBus: Bus = {
            plateNumber,
            model,
            currentLocation,
            geoLocation: {
                type: 'Point',
                coordinates: [lon, lat], 
            },
            speed,
            route,
            driverName,
            driverPhone,
        };

        try {
            const savedBus = await addBus(newBus);
            onBusAdded(savedBus);
            setIsSuccess(true);
            setMessage(' Bus registered successfully!');
            
            setPlateNumber('');
            setModel('');
            setCurrentLocation('');
            setLatitude('0');
            setLongitude('0');
            setSpeed('');
            setRoute('');
            setDriverName('');
            setDriverPhone('');
            
            setTimeout(() => {
                setMessage(null);
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error registering bus:', error);
            setIsSuccess(false);
            setMessage('x Failed to register bus. Please try again.');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.closeButton}>×</button>
                <h2>Register New Bus</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Plate Number"
                        className={styles.input}
                        value={plateNumber}
                        onChange={(e) => setPlateNumber(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Plate Number"
                        className={styles.input}
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Current Location"
                        className={styles.input}
                        value={currentLocation}
                        onChange={(e) => setCurrentLocation(e.target.value)}
                        required
                    />
                    <input
                        type="text" 
                        placeholder="Latitude"
                        className={styles.input}
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        required
                    />
                    <input
                        type="text" 
                        placeholder="Longitude"
                        className={styles.input}
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Speed (e.g., 35 mph)"
                        className={styles.input}
                        value={speed}
                        onChange={(e) => setSpeed(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Route (e.g., Route 5)"
                        className={styles.input}
                        value={route}
                        onChange={(e) => setRoute(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Driver Name"
                        className={styles.input}
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Driver Phone (e.g., 555-123-4567)"
                        className={styles.input}
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>

                {/* Message Box */}
                {message && (
                    <div
                        className={isSuccess ? styles.successMessage : styles.errorMessage}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewBusModal;
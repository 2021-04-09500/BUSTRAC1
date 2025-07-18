
export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface Bus {
    id: string;
    plateNumber: string;
    geoLocation: {
        type: string;
        coordinates: [number, number]; 
    };
}

export interface Route {
    id: string;
    name: string;
    startLocation: string;
    endLocation: string;
    assignedBus: Bus;  
}

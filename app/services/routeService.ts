import { apiRequest } from './authService';

export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface Waypoint {
    name: string;
    latitude: number;
    longitude: number;
}

export interface Route {
    id?: string;
    name: string;
    startLocation: Coordinate;
    endLocation: Coordinate;
    busId: string;
    coordinates?: Coordinate[];
    waypoints?: Waypoint[];
    distance?: number;
    estimatedTime?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Bus {
    id: string;
    plateNumber: string;
}


export const getAllRoutes = async (): Promise<Route[]> => {
    try {
        const response = await apiRequest('/routes', 'get');
        console.log("API Response:", response);
        if (!Array.isArray(response)) {
            throw new Error("Invalid response format: expected an array");
        }
        return response;
    } catch (err) {
        console.error("API Error:", err);
        throw new Error(`Failed to fetch routes: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
};

export const getRouteById = async (routeId: string): Promise<Route> => {
    try {
        return await apiRequest(`/routes/${routeId}`, 'get');
    } catch (err) {
        console.error("Error fetching route by ID:", err);
        throw new Error(`Route not found: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
};

export const addRoute = async (route: Omit<Route, 'id' | 'coordinates' | 'waypoints' | 'distance' | 'estimatedTime' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Route> => {
    return await apiRequest('/routes', 'post', route);
};

export const getAllBuses = async (): Promise<Bus[]> => {
    return await apiRequest('/buses', 'get');
};

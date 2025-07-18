import { apiRequest } from './authService';

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



export const MDVRClientService = {
    async getAllBuses(): Promise<Bus[]> {
        try {
            return await apiRequest('/buses', 'get');
        } catch (error) {
            console.error('getAllBuses failed:', error);
            throw error;
        }
    },

    async getBusStatus(busId: string): Promise<Bus> {
        try {
            return await apiRequest(`/buses/${busId}/status`, 'get');
        } catch (error) {
            console.error('getBusStatus failed for busId:', busId, error);
            throw error;
        }
    },

}
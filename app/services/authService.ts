import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";


export const register = async (phoneNo: string, email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            phoneNo,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.message || "Registration failed.");
        } else {
            throw new Error("Registration failed.");
        }
    }
};


export const login = async (phoneOrEmail: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            phoneNo: isPhoneNumber(phoneOrEmail) ? phoneOrEmail : null,
            email: isPhoneNumber(phoneOrEmail) ? null : phoneOrEmail,
            password,
        });
        localStorage.setItem("token", response.data.token);
        return response.data;
    } catch (error) {
        throw new Error("Login failed. Please check your credentials.");
    }
};


export const loginWithGoogle = () => {
    window.location.href = `${API_URL}/oauth2/authorization/google`;
};


export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};


export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
};


export const getToken = () => {
    return localStorage.getItem("token");
};


export const apiRequest = async (url: string, method: 'get' | 'post' | 'put' | 'delete', data?: any) => {
    const token = getToken();
    const headers: any = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('No token found in localStorage. Proceeding without Authorization header.');
    }

    try {
        const response = await axios({
            url: `${API_URL}${url}`,
            method,
            data,
            headers,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.message || `API request failed: ${url} - Status: ${status}`;
            
            
            if (status === 401) {
                logout();
                throw new Error("Session expired. Redirecting to login.");
            }

            throw new Error(errorMessage);
        } else {
            throw new Error(`API request failed: ${url} - Network error or server not reachable`);
        }
    }
};

const isPhoneNumber = (input: string): boolean => {

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(input);
};
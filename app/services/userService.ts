import { apiRequest } from './authService';

const API_URL = '/users';

interface User {
  id: string;
  name: string;
  email: string; 
  phoneNo: string; 
  role: string; 
}


export const fetchUsers = async (): Promise<User[]> => {
  try {
    const adminUsers: User[] = await apiRequest('/users', 'get');
    const parentUsers: User[] = await apiRequest('/parents', 'get');
    const conductorUsers: User[] = await apiRequest('/conductors', 'get');
    const studentUsers: User[] = await apiRequest('/students', 'get');

  
    const allUsers = [
      ...(adminUsers || []),
      ...(parentUsers || []),
      ...(conductorUsers || []),
      ...(studentUsers || []),
    ];

    return allUsers;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching users:', err.message);
    throw new Error(err.message || 'Failed to fetch users');
  }
};


export const fetchConductors = async (): Promise<User[]> => {
  try {
    const conductors: User[] = await apiRequest('/conductors', 'get');
    return conductors;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching conductors:', err.message);
    throw new Error(err.message || 'Failed to fetch conductors');
  }
};


export const fetchUserById = async (userId: number): Promise<User> => {
  try {
    const user: User = await apiRequest(`${API_URL}/${userId}`, 'get');
    return user;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`Error fetching user with ID ${userId}:`, err.message);
    throw new Error(err.message || `Failed to fetch user with ID ${userId}`);
  }
};


export const createUser = async (userData: { role: string; [key: string]: any }): Promise<User> => {
  let endpoint = '';
  switch (userData.role.toUpperCase()) {
    case 'STUDENT':
      endpoint = '/students';
      break;
    case 'PARENT':
      endpoint = '/parents';
      break;
    case 'CONDUCTOR':
      endpoint = '/conductors';
      break;
    case 'ADMIN':
      endpoint = '/users';
      break;
    default:
      throw new Error('Invalid user role');
  }

  try {
    const newUser: User = await apiRequest(endpoint, 'post', userData);
    return newUser;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error creating user:', err.message);
    throw new Error(err.message || 'Failed to create user');
  }
};


export const createStudentParent = async (data: { [key: string]: any }): Promise<User> => {
  try {
    const newUser: User = await apiRequest('/students/student-parent', 'post', data);
    return newUser;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error creating student and parent:', err.message);
    throw new Error(err.message || 'Failed to create student and parent');
  }
};


export const updateUser = async (userId: number, userData: { role: string; [key: string]: any }): Promise<User> => {
  let endpoint = '';
  switch (userData.role.toUpperCase()) {
    case 'STUDENT':
      endpoint = '/students';
      break;
    case 'PARENT':
      endpoint = '/parents';
      break;
    case 'CONDUCTOR':
      endpoint = '/conductors';
      break;
    case 'ADMIN':
      endpoint = '/users';
      break;
    default:
      throw new Error('Invalid user role');
  }

  try {
    const updatedUser: User = await apiRequest(`${endpoint}/${userId}`, 'put', userData);
    return updatedUser;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`Error updating user with ID ${userId}:`, err.message);
    throw new Error(err.message || `Failed to update user with ID ${userId}`);
  }
};


export const deleteUser = async (userId: number, role: string): Promise<void> => {
  let endpoint = '';
  switch (role.toUpperCase()) {
    case 'STUDENT':
      endpoint = '/students';
      break;
    case 'PARENT':
      endpoint = '/parents';
      break;
    case 'CONDUCTOR':
      endpoint = '/conductors';
      break;
    case 'ADMIN':
      endpoint = '/users';
      break;
    default:
      throw new Error('Invalid user role');
  }

  try {
    await apiRequest(`${endpoint}/${userId}`, 'delete');
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`Error deleting user with ID ${userId}:`, err.message);
    throw new Error(err.message || `Failed to delete user with ID ${userId}`);
  }
};
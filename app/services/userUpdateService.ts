import { apiRequest } from './authService';

export const updateUser = async (
  id: string,
  role: string,
  userData: Record<string, any>
): Promise<any> => {
  try {
    let endpoint = '';

    switch (role.toLowerCase()) {
      case 'admin':
        endpoint = '/users';
        break;
      case 'parent':
        endpoint = '/parents';
        break;
      case 'student':
        endpoint = '/students';
        break;
      case 'conductor':
        endpoint = '/conductors';
        break;
      default:
        throw new Error(`Invalid role: '${role}'. Must be admin, parent, student, or conductor.`);
    }

    const response = await apiRequest(`${endpoint}/${id}`, 'put', userData);
    return response;

  } catch (error: any) {
    console.error(`Error updating ${role} with ID ${id}:`, error.message || error);
    throw new Error(error.message || 'Failed to update user');
  }
};




'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from "@/app/ui/dashboard/users/singleuserpage/singleUserPage.module.css";
import { apiRequest } from '@/app/services/authService';
import { updateUser } from '@/app/services/userUpdateService';

const SingleUserPage = () => {
  const { id, type } = useParams();
  const [userData, setUserData] = useState<any>({
    name: '',
    email: '',
    role: '',
    phoneNo: '',
    address: '',
    grade: '',
    route: '',
    password: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getEndpoint = (type: string) => {
    switch (type.toLowerCase()) {
      case 'admin': return 'users';
      case 'parent': return 'parents';
      case 'student': return 'students';
      case 'conductor': return 'conductors';
      default: return 'users';
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const endpoint = getEndpoint(type as string);
        const data = await apiRequest(`/${endpoint}/${id}`, 'get');
        setUserData(data);
      } catch (err: any) {
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(id as string, type as string, userData);
      alert('User updated successfully');
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const role = (type as string).toLowerCase();

  if (loading) return <p>Loading user...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Update {type}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          required
        />

        {(role === 'admin' || role === 'parent' || role === 'conductor') && (
          <>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email || ''}
              onChange={handleChange}
            />
          </>
        )}

        {(role === 'parent' || role === 'conductor'|| role === 'admin') && (
          <>
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNo"
              value={userData.phoneNo || ''}
              onChange={handleChange}
            />
          </>
        )}

        {role === 'parent' && (
          <>
            <label>Address:</label>
            <textarea
              name="address"
              value={userData.address || ''}
              rows={3}
              onChange={handleChange}
            />
          </>
        )}

        {(role === 'conductor' || role === 'student') && (
          <>
            <label>Route:</label>
            <input
              type="text"
              name="route"
              value={userData.route || ''}
              onChange={handleChange}
            />
          </>
        )}

        {role === 'student' && (
          <>
            <label>Grade:</label>
            <input
              type="text"
              name="grade"
              value={userData.grade || ''}
              onChange={handleChange}
            />
          </>
        )}

        <button type="submit" className={styles.button}>Update</button>
      </form>
    </div>
  );
};

export default SingleUserPage;

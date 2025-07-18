"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './sidebar.module.css';
import {
  MdDashboard,
  MdPeople,
  MdOutlineMessage,
  MdAnalytics,
  MdOutlineSettings,
  MdOutlineLogout,
} from 'react-icons/md';
import { LuCctv } from 'react-icons/lu';
import { apiRequest, logout } from '@/app/services/authService';
import { FaRoute } from "react-icons/fa";

const menuItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <MdDashboard />,
  },
  {
    title: 'Users',
    path: '/dashboard/users',
    icon: <MdPeople />,
  },
  {
    title: 'Routes',
    path: '/dashboard/route',
    icon: <FaRoute />
  },
  {
    title: 'Live View',
    path: '/dashboard/liveview',
    icon: <LuCctv />,
  },
  {
    title: 'Messaging',
    path: '/dashboard/Messaging',
    icon: <MdOutlineMessage />,
  },
  {
    title: 'Reports',
    path: '/dashboard/reports',
    icon: <MdAnalytics />,
  },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: <MdOutlineSettings />,
  },
];

interface Admin {
  name: string;
  role: string;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');
  
        const data: Admin = await apiRequest('/users/me', 'get');
        setAdmin(data);
      } catch (error: unknown) {
        console.error('Error fetching admin data:', (error as Error).message);
        // Don't setError here to prevent showing "API request failed"
      } finally {
        setLoading(false);
      }
    };
  
    fetchAdminData();
  }, []);
  

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src={'/image.png'}
          alt={admin?.name || 'Default Avatar'}
          width={50}
          height={50}
        />
        <div className={styles.userDetails}>
          <span className={styles.userName}>{admin?.name || 'Oprah Lewis'}</span>
          <span className={styles.userTitle}>{admin?.role || 'Administrator'}</span>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li
            className={`${styles.cat} ${pathname === cat.path && styles.active}`}
            key={cat.title}
          >
            <Link href={cat.path}>
              {cat.icon} {cat.title}
            </Link>
          </li>
        ))}
      </ul>

      <button className={styles.logout} onClick={logout}>
        <MdOutlineLogout />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
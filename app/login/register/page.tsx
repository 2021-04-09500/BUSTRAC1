"use client";

import React, { useState } from 'react';
import styles from "@/app/ui/login/register/register.module.css";
import { register } from '@/app/services/authService';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            await register(username, email, password);
            router.push('/login'); 
        } catch (error) {
            console.error('Registration failed:', error);
            if (error instanceof Error) {
                alert(error.message); 
            } else {
                alert('An unknown error occurred');
            }
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleRegister} className={styles.form}>
                <h1>Register</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
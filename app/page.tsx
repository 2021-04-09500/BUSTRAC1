import React from 'react';
import styles from '@/app/ui/homepage/homepage.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <img src="/logo.png" alt="BusTrack Logo" className={styles.logo} />
        <Link href="login"><button className={styles.loginButton}>Login</button></Link>
      </nav>

      <main className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Track. Manage. <span className={styles.highlight}>Monitor.</span>
          </h1>
          <p className={styles.heroDescription}>
            Your all-in-one solution for school bus tracking, route management, and monitoring.
          </p>
          <button className={styles.ctaButton}>Get Started</button>
        </div>
        <div className={styles.heroImage}></div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} School Bus Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
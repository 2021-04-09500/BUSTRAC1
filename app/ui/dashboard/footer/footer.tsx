import React from 'react';
import styles from  './footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.container}>
            <div className={styles.logo}>Oprah Lewis</div>
            <div className={styles.text}>
                <p>&copy; {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;